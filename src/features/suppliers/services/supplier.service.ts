import { SupplierRepository } from "../repositories/supplier.repository";
import { logger } from "@/lib/logger";
import type { Supplier, CreateSupplierInput, UpdateSupplierInput, SupplierFilters, PaginatedResult } from "../types";

export const SupplierService = {
  async getAll(filters?: SupplierFilters): Promise<PaginatedResult<Supplier>> {
    try {
      return await SupplierRepository.findAll(filters);
    } catch (error) {
      logger.error("Failed to fetch suppliers", { filters, error });
      throw error;
    }
  },

  async getById(id: number): Promise<Supplier | undefined> {
    try {
      return await SupplierRepository.findById(id);
    } catch (error) {
      logger.error("Failed to fetch supplier", { id, error });
      throw error;
    }
  },

  async search(query: string): Promise<Supplier[]> {
    try {
      return await SupplierRepository.search(query);
    } catch (error) {
      logger.error("Failed to search suppliers", { query, error });
      throw error;
    }
  },

  async create(input: CreateSupplierInput): Promise<Supplier> {
    try {
      return await SupplierRepository.create(input);
    } catch (error) {
      logger.error("Failed to create supplier", { input, error });
      throw error;
    }
  },

  async update(id: number, input: UpdateSupplierInput): Promise<Supplier | undefined> {
    try {
      return await SupplierRepository.update(id, input);
    } catch (error) {
      logger.error("Failed to update supplier", { id, input, error });
      throw error;
    }
  },

  async archive(id: number): Promise<void> {
    try {
      await SupplierRepository.archive(id);
    } catch (error) {
      logger.error("Failed to archive supplier", { id, error });
      throw error;
    }
  },

  async getTopDebtors(limit?: number): Promise<(Supplier & { totalPurchases: number })[]> {
    try {
      return await SupplierRepository.findTopDebtors(limit);
    } catch (error) {
      logger.error("Failed to fetch top debtors", { limit, error });
      throw error;
    }
  },
};
