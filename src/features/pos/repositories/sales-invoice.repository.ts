import { getDb } from "@/lib/db";
import { salesInvoices } from "@/lib/db/schema";
import { eq, like, and, desc, asc, count, sql, type SQL } from "drizzle-orm";
import type { SaleInvoice, SaleFilters, PaginatedResult } from "../types";

export const SalesInvoiceRepository = {
  async findAll(filters?: SaleFilters): Promise<PaginatedResult<SaleInvoice>> {
    const db = await getDb();
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [];

    if (filters?.search) {
      conditions.push(like(salesInvoices.invoiceNumber, `%${filters.search}%`));
    }

    if (filters?.dateFrom) {
      conditions.push(sql`${salesInvoices.createdAt} >= ${filters.dateFrom}`);
    }

    if (filters?.dateTo) {
      conditions.push(sql`${salesInvoices.createdAt} <= ${filters.dateTo}`);
    }

    if (filters?.paymentMethod) {
      conditions.push(eq(salesInvoices.paymentMethod, filters.paymentMethod));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortDirection = filters?.sortOrder === "desc" ? desc : asc;
    const sortBy = filters?.sortBy === "netTotal" ? salesInvoices.netTotal : salesInvoices.createdAt;

    const [totalResult] = await db
      .select({ count: count() })
      .from(salesInvoices)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const items = await db
      .select()
      .from(salesInvoices)
      .where(whereClause)
      .orderBy(sortDirection(sortBy))
      .limit(pageSize)
      .offset(offset);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findById(id: number): Promise<SaleInvoice | undefined> {
    const db = await getDb();
    const result = await db
      .select()
      .from(salesInvoices)
      .where(eq(salesInvoices.id, id))
      .limit(1);

    return result[0];
  },

  async create(input: Omit<SaleInvoice, "id" | "createdAt" | "updatedAt" | "items">): Promise<SaleInvoice> {
    const db = await getDb();
    const result = await db
      .insert(salesInvoices)
      .values({
        invoiceNumber: input.invoiceNumber,
        customerName: input.customerName ?? null,
        subtotal: input.subtotal,
        discount: input.discount,
        tax: input.tax,
        netTotal: input.netTotal,
        paymentMethod: input.paymentMethod,
        cashReceived: input.cashReceived ?? null,
        changeAmount: input.changeAmount ?? null,
      })
      .returning();

    return result[0];
  },
};
