import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { ListProductsQueryParams, GetProductParams } from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }

  const { category, featured } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(productsTable.category, category));
  if (featured !== undefined) conditions.push(eq(productsTable.featured, featured));

  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const formatted = products.map((p) => ({
    ...p,
    price: parseFloat(p.price),
  }));

  res.json(formatted);
});

router.get("/products/:id", async (req, res) => {
  const parsed = GetProductParams.safeParse({ id: parseInt(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({ ...product, price: parseFloat(product.price) });
});

export default router;
