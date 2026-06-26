import { getDb } from "@/lib/db";
import { supplierLedger } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import type { SupplierLedgerEntry, PaginatedResult } from "../types";

type ReferenceType = "purchase_invoice" | "payment" | "manual_adjustment";

export const SupplierLedgerRepository = {
  async findBySupplierId(
    supplierId: number,
    page = 1,
    pageSize = 20,
  ): Promise<PaginatedResult<SupplierLedgerEntry>> {
    const db = await getDb();
    const offset = (page - 1) * pageSize;

    const whereClause = eq(supplierLedger.supplierId, supplierId);

    const [totalResult] = await db
      .select({ count: count() })
      .from(supplierLedger)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const items = await db
      .select()
      .from(supplierLedger)
      .where(whereClause)
      .orderBy(desc(supplierLedger.createdAt))
      .limit(pageSize)
      .offset(offset);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async create(input: {
    supplierId: number;
    referenceType: ReferenceType;
    referenceId?: number | null;
    amount: number;
    balanceAfter: number;
    description?: string | null;
  }): Promise<SupplierLedgerEntry> {
    const db = await getDb();
    const result = await db.insert(supplierLedger).values(input).returning();
    return result[0];
  },
};
