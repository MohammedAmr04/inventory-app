import { ProductRepository } from "../repositories/product.repository";
import { logger } from "@/lib/logger";
import type { Product, PaginatedResult } from "../types";

export const LowStockService = {
  async getLowStockProducts(page?: number, pageSize?: number): Promise<PaginatedResult<Product>> {
    try {
      return await ProductRepository.findLowStock(page, pageSize);
    } catch (error) {
      logger.error("Failed to fetch low stock products", { error });
      throw error;
    }
  },

  async getLowStockCount(): Promise<number> {
    try {
      return await ProductRepository.countLowStock();
    } catch (error) {
      logger.error("Failed to count low stock products", { error });
      throw error;
    }
  },
};
