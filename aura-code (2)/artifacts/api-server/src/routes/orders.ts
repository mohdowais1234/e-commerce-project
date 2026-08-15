import { Router } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";

const router = Router();

router.get("/orders", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, req.user.id));

  const formatted = orders.map((o) => ({
    ...o,
    total: parseFloat(o.total),
    items: o.items as Array<{ productId: number; name: string; price: number; quantity: number }>,
  }));

  res.json(formatted);
});

router.post("/orders", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order data" });
    return;
  }

  const { items, total } = parsed.data;

  const [order] = await db.insert(ordersTable).values({
    userId: req.user.id,
    status: "pending",
    total: total.toString(),
    items: items as unknown as Record<string, unknown>[],
  }).returning();

  res.status(201).json({
    ...order,
    total: parseFloat(order.total),
    items: order.items as Array<{ productId: number; name: string; price: number; quantity: number }>,
  });
});

export default router;
