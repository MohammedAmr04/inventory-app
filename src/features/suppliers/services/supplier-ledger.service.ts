import { SupplierLedgerRepository } from "../repositories/supplier-ledger.repository";
import { logger } from "@/lib/logger";
import type { SupplierLedgerEntry, PaginatedResult } from "../types";

export const SupplierLedgerService = {
  async getBySupplierId(
    supplierId: number,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedResult<SupplierLedgerEntry>> {
    try {
      return await SupplierLedgerRepository.findBySupplierId(supplierId, page, pageSize);
    } catch (error) {
      logger.error("Failed to fetch supplier ledger", { supplierId, page, pageSize, error });
      throw error;
    }
  },
};
