import { getDb } from "@/lib/db";
import { stockAdjustments, products } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import type { StockAdjustment, PaginatedResult } from "../types";

interface CreateStockAdjustmentData {
  productId: number;
  type: "increase" | "decrease" | "set";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string | null;
}

export const StockAdjustmentRepository = {
  async findAll(page = 1, pageSize = 20): Promise<PaginatedResult<StockAdjustment>> {
    const db = await getDb();
    const offset = (page - 1) * pageSize;

    const totalResult = await db
      .select({ count: count() })
      .from(stockAdjustments);

    const total = totalResult[0]?.count ?? 0;

    const items = await db
      .select({
        id: stockAdjustments.id,
        productId: stockAdjustments.productId,
        type: stockAdjustments.type,
        quantity: stockAdjustments.quantity,
        previousStock: stockAdjustments.previousStock,
        newStock: stockAdjustments.newStock,
        reason: stockAdjustments.reason,
        createdAt: stockAdjustments.createdAt,
        productName: products.name,
      })
      .from(stockAdjustments)
      .leftJoin(products, eq(stockAdjustments.productId, products.id))
      .orderBy(desc(stockAdjustments.createdAt))
      .limit(pageSize)
      .offset(offset);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async findByProductId(productId: number): Promise<StockAdjustment[]> {
    const db = await getDb();
    return db
      .select({
        id: stockAdjustments.id,
        productId: stockAdjustments.productId,
        type: stockAdjustments.type,
        quantity: stockAdjustments.quantity,
        previousStock: stockAdjustments.previousStock,
        newStock: stockAdjustments.newStock,
        reason: stockAdjustments.reason,
        createdAt: stockAdjustments.createdAt,
        productName: products.name,
      })
      .from(stockAdjustments)
      .leftJoin(products, eq(stockAdjustments.productId, products.id))
      .where(eq(stockAdjustments.productId, productId))
      .orderBy(desc(stockAdjustments.createdAt));
  },

  async create(input: CreateStockAdjustmentData): Promise<StockAdjustment> {
    const db = await getDb();
    const result = await db.insert(stockAdjustments).values({
      productId: input.productId,
      type: input.type,
      quantity: input.quantity,
      previousStock: input.previousStock,
      newStock: input.newStock,
      reason: input.reason,
    }).returning();
    const row = result[0];
    return {
      ...row,
      productName: null,
    };
  },
};
