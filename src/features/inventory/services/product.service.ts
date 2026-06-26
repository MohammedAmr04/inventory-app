import { ProductRepository } from "../repositories/product.repository";
import { logger } from "@/lib/logger";
import type { Product, CreateProductInput, UpdateProductInput, ProductFilters, PaginatedResult } from "../types";

export const ProductService = {
  async getAll(filters?: ProductFilters): Promise<PaginatedResult<Product>> {
    try {
      return await ProductRepository.findAll(filters);
    } catch (error) {
      logger.error("Failed to fetch products", { filters, error });
      throw error;
    }
  },

  async getById(id: number): Promise<Product | undefined> {
    try {
      return await ProductRepository.findById(id);
    } catch (error) {
      logger.error("Failed to fetch product", { id, error });
      throw error;
    }
  },

  async findByBarcode(barcode: string): Promise<Product | undefined> {
    try {
      return await ProductRepository.findByBarcode(barcode);
    } catch (error) {
      logger.error("Failed to find product by barcode", { barcode, error });
      throw error;
    }
  },

  async searchBarcode(query: string): Promise<Product[]> {
    try {
      return await ProductRepository.searchBarcode(query);
    } catch (error) {
      logger.error("Failed to search products by barcode", { query, error });
      throw error;
    }
  },

  async create(input: CreateProductInput): Promise<Product> {
    try {
      return await ProductRepository.create(input);
    } catch (error) {
      logger.error("Failed to create product", { input, error });
      throw error;
    }
  },

  async update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    try {
      return await ProductRepository.update(id, input);
    } catch (error) {
      logger.error("Failed to update product", { id, input, error });
      throw error;
    }
  },

  async archive(id: number): Promise<void> {
    try {
      await ProductRepository.archive(id);
    } catch (error) {
      logger.error("Failed to archive product", { id, error });
      throw error;
    }
  },

  async countLowStock(): Promise<number> {
    try {
      return await ProductRepository.countLowStock();
    } catch (error) {
      logger.error("Failed to count low stock products", { error });
      throw error;
    }
  },
};
