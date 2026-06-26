import { getDb } from "@/lib/db";
import { suppliers, supplierPayments, supplierLedger } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { SupplierPaymentRepository } from "../repositories/supplier-payment.repository";
import { logger } from "@/lib/logger";
import type { SupplierPayment, CreateSupplierPaymentInput, PaginatedResult } from "../types";

export const SupplierPaymentService = {
  async getAll(
    supplierId?: number,
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedResult<SupplierPayment>> {
    try {
      return await SupplierPaymentRepository.findAll(supplierId, page, pageSize);
    } catch (error) {
      logger.error("Failed to fetch supplier payments", { supplierId, page, pageSize, error });
      throw error;
    }
  },

  async create(input: CreateSupplierPaymentInput): Promise<SupplierPayment> {
    const db = await getDb();
    try {
      return await db.transaction(async (tx) => {
        const paymentDate = input.paymentDate ?? sql`CURRENT_TIMESTAMP`;

        const [payment] = await tx
          .insert(supplierPayments)
          .values({
            supplierId: input.supplierId,
            amount: input.amount,
            paymentDate: paymentDate as unknown as string,
            notes: input.notes ?? null,
          })
          .returning();

        const [supplier] = await tx
          .select({ currentBalance: suppliers.currentBalance })
          .from(suppliers)
          .where(eq(suppliers.id, input.supplierId))
          .limit(1);

        const newBalance = (supplier?.currentBalance ?? 0) - input.amount;

        await tx
          .update(suppliers)
          .set({ currentBalance: newBalance, updatedAt: sql`CURRENT_TIMESTAMP` })
          .where(eq(suppliers.id, input.supplierId));

        await tx
          .insert(supplierLedger)
          .values({
            supplierId: input.supplierId,
            referenceType: "payment",
            referenceId: payment.id,
            amount: input.amount,
            balanceAfter: newBalance,
            description: `Payment of ${input.amount}`,
          })
          .returning();

        return payment as unknown as SupplierPayment;
      });
    } catch (error) {
      logger.error("Failed to create supplier payment", { input, error });
      throw error;
    }
  },
};
