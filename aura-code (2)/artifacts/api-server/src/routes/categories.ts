import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";

const router = Router();

router.get("/categories", async (_req, res) => {
  const categories = await db.select().from(categoriesTable);
  res.json(categories);
});

export default router;
