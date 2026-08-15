import { Router } from "express";
import crypto from "crypto";
import { db, ordersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateRazorpayOrderBody, VerifyRazorpayPaymentBody } from "@workspace/api-zod";

const router = Router();

router.post("/payments/razorpay/create-order", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateRazorpayOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { amount, orderId } = parsed.data;

  // Verify the order belongs to this user
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(and(eq(ordersTable.id, orderId), eq(ordersTable.userId, req.user.id)));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID!;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    // Return mock order for development without key secret
    const mockRazorpayOrderId = `order_test_${Date.now()}`;
    await db.update(ordersTable)
      .set({ razorpayOrderId: mockRazorpayOrderId })
      .where(eq(ordersTable.id, orderId));

    res.json({
      razorpayOrderId: mockRazorpayOrderId,
      amount,
      currency: "INR",
      keyId,
    });
    return;
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // paise
        currency: "INR",
        receipt: `order_${orderId}`,
      }),
    });

    if (!response.ok) {
      res.status(500).json({ error: "Failed to create Razorpay order" });
      return;
    }

    const data = await response.json() as { id: string; amount: number; currency: string };

    // Store the Razorpay order ID on our order
    await db.update(ordersTable)
      .set({ razorpayOrderId: data.id })
      .where(eq(ordersTable.id, orderId));

    res.json({
      razorpayOrderId: data.id,
      amount: data.amount / 100,
      currency: data.currency,
      keyId,
    });
  } catch {
    res.status(500).json({ error: "Payment gateway error" });
  }
});

router.post("/payments/razorpay/verify", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = VerifyRazorpayPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = parsed.data;

  // Verify the order belongs to this user and has the expected Razorpay order ID
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(and(eq(ordersTable.id, orderId), eq(ordersTable.userId, req.user.id)));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (order.razorpayOrderId !== razorpayOrderId) {
    res.status(400).json({ success: false, message: "Order ID mismatch" });
    return;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    // Development mode without secret key — skip signature verification
    await db.update(ordersTable)
      .set({ status: "paid", razorpayPaymentId })
      .where(eq(ordersTable.id, orderId));
    res.json({ success: true, message: "Payment recorded (development mode)" });
    return;
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    res.status(400).json({ success: false, message: "Invalid payment signature" });
    return;
  }

  await db.update(ordersTable)
    .set({ status: "paid", razorpayPaymentId })
    .where(eq(ordersTable.id, orderId));

  res.json({ success: true, message: "Payment verified successfully" });
});

export default router;
