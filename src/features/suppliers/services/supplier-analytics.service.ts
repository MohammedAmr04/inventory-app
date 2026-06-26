import { getDb } from "@/lib/db";
import { suppliers } from "@/lib/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { SupplierRepository } from "../repositories/supplier.repository";
import { logger } from "@/lib/logger";
import type { SupplierAnalytics } from "../types";

export const SupplierAnalyticsService = {
  async getAnalytics(): Promise<SupplierAnalytics> {
    try {
      const db = await getDb();

      const [totalResult] = await db
        .select({ count: count() })
        .from(suppliers)
        .where(eq(suppliers.isActive, true));

      const [balanceResult] = await db
        .select({ total: sql<number>`COALESCE(SUM(${suppliers.currentBalance}), 0)` })
        .from(suppliers)
        .where(eq(suppliers.isActive, true));

      const topDebtors = await SupplierRepository.findTopDebtors(10);

      return {
        totalSuppliers: totalResult?.count ?? 0,
        totalOutstandingPayables: balanceResult?.total ?? 0,
        topDebtors,
      };
    } catch (error) {
      logger.error("Failed to fetch supplier analytics", { error });
      throw error;
    }
  },
};
