import { getDb } from "@/lib/db";
import { products, stockAdjustments as stockAdjustmentsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { StockAdjustmentRepository } from "../repositories/stock-adjustment.repository";
import { logger } from "@/lib/logger";
import type { StockAdjustment, CreateStockAdjustmentInput, PaginatedResult } from "../types";

export const StockAdjustmentService = {
  async getAll(page?: number, pageSize?: number): Promise<PaginatedResult<StockAdjustment>> {
    try {
      return await StockAdjustmentRepository.findAll(page, pageSize);
    } catch (error) {
      logger.error("Failed to fetch stock adjustments", { error });
      throw error;
    }
  },

  async getByProductId(productId: number): Promise<StockAdjustment[]> {
    try {
      return await StockAdjustmentRepository.findByProductId(productId);
    } catch (error) {
      logger.error("Failed to fetch stock adjustments by product", { productId, error });
      throw error;
    }
  },

  async create(input: CreateStockAdjustmentInput): Promise<StockAdjustment> {
    const db = await getDb();
    try {
      return await db.transaction(async (tx) => {
        const product = await tx
          .select()
          .from(products)
          .where(eq(products.id, input.productId))
          .limit(1);

        if (!product[0]) {
          throw new Error(`Product with id ${input.productId} not found`);
        }

        const currentStock = product[0].stock;
        let newStock: number;

        switch (input.type) {
          case "increase":
            newStock = currentStock + input.quantity;
            break;
          case "decrease":
            newStock = currentStock - input.quantity;
            break;
          case "set":
            newStock = input.quantity;
            break;
        }

        if (newStock < 0) {
          throw new Error("Insufficient stock");
        }

        await tx
          .update(products)
          .set({ stock: newStock })
          .where(eq(products.id, input.productId));

        const adjustment = await tx
          .insert(stockAdjustmentsTable)
          .values({
            productId: input.productId,
            type: input.type,
            quantity: input.quantity,
            previousStock: currentStock,
            newStock,
            reason: input.reason ?? null,
          })
          .returning();

        return adjustment[0] as unknown as StockAdjustment;
      });
    } catch (error) {
      logger.error("Failed to create stock adjustment", { input, error });
      throw error;
    }
  },
};

