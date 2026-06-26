import { ProductRepository } from "../repositories/product.repository";
import { logger } from "@/lib/logger";
import type { Product } from "../types";

export const BarcodeService = {
  async searchByBarcode(barcode: string): Promise<Product | undefined> {
    try {
      return await ProductRepository.findByBarcode(barcode);
    } catch (error) {
      logger.error("Failed to search by barcode", { barcode, error });
      throw error;
    }
  },

  async searchBarcodePartial(query: string): Promise<Product[]> {
    try {
      return await ProductRepository.searchBarcode(query);
    } catch (error) {
      logger.error("Failed to search barcode partial", { query, error });
      throw error;
    }
  },
};
