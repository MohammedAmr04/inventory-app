import { getDb } from "@/lib/db";
import { supplierPayments, suppliers } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import type { SupplierPayment, PaginatedResult } from "../types";

export const SupplierPaymentRepository = {
  async findAll(
    supplierId?: number,
    page = 1,
    pageSize = 20,
  ): Promise<PaginatedResult<SupplierPayment>> {
    const db = await getDb();
    const offset = (page - 1) * pageSize;

    const whereClause = supplierId !== undefined
      ? eq(supplierPayments.supplierId, supplierId)
      : undefined;

    const [totalResult] = await db
      .select({ count: count() })
      .from(supplierPayments)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const items = await db
      .select({
        id: supplierPayments.id,
        supplierId: supplierPayments.supplierId,
        amount: supplierPayments.amount,
        paymentDate: supplierPayments.paymentDate,
        notes: supplierPayments.notes,
        createdAt: supplierPayments.createdAt,
        supplierName: suppliers.name,
      })
      .from(supplierPayments)
      .leftJoin(suppliers, eq(supplierPayments.supplierId, suppliers.id))
      .where(whereClause)
      .orderBy(desc(supplierPayments.paymentDate))
      .limit(pageSize)
      .offset(offset);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async create(input: {
    supplierId: number;
    amount: number;
    paymentDate: string;
    notes: string | null;
  }): Promise<SupplierPayment> {
    const db = await getDb();
    const result = await db.insert(supplierPayments).values(input).returning();
    return result[0];
  },
};
