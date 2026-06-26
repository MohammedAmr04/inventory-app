import { getDb } from "@/lib/db";
import { purchaseInvoices, suppliers } from "@/lib/db/schema";
import { eq, like, and, desc, asc, count, sql, type SQL } from "drizzle-orm";
import type { PurchaseInvoice, PurchaseFilters, PaginatedResult } from "../types";

export const PurchaseInvoiceRepository = {
  async findAll(filters?: PurchaseFilters): Promise<PaginatedResult<PurchaseInvoice>> {
    const db = await getDb();
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [];

    if (filters?.search) {
      conditions.push(like(purchaseInvoices.invoiceNumber, `%${filters.search}%`));
    }

    if (filters?.supplierId !== undefined) {
      conditions.push(eq(purchaseInvoices.supplierId, filters.supplierId));
    }

    if (filters?.dateFrom) {
      conditions.push(sql`${purchaseInvoices.purchaseDate} >= ${filters.dateFrom}`);
    }

    if (filters?.dateTo) {
      conditions.push(sql`${purchaseInvoices.purchaseDate} <= ${filters.dateTo}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = filters?.sortBy ?? "purchaseDate";
    const sortDirection = filters?.sortOrder === "desc" ? desc : asc;
    const orderByMap = {
      purchaseDate: purchaseInvoices.purchaseDate,
      totalAmount: purchaseInvoices.totalAmount,
      createdAt: purchaseInvoices.createdAt,
    } as const;

    const [totalResult] = await db
      .select({ count: count() })
      .from(purchaseInvoices)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const items = await db
      .select({
        id: purchaseInvoices.id,
        supplierId: purchaseInvoices.supplierId,
        invoiceNumber: purchaseInvoices.invoiceNumber,
        subtotal: purchaseInvoices.subtotal,
        discount: purchaseInvoices.discount,
        totalAmount: purchaseInvoices.totalAmount,
        paidAmount: purchaseInvoices.paidAmount,
        dueAmount: purchaseInvoices.dueAmount,
        notes: purchaseInvoices.notes,
        purchaseDate: purchaseInvoices.purchaseDate,
        createdAt: purchaseInvoices.createdAt,
        updatedAt: purchaseInvoices.updatedAt,
        supplierName: suppliers.name,
      })
      .from(purchaseInvoices)
      .leftJoin(suppliers, eq(purchaseInvoices.supplierId, suppliers.id))
      .where(whereClause)
      .orderBy(sortDirection(orderByMap[sortColumn] ?? purchaseInvoices.purchaseDate))
      .limit(pageSize)
      .offset(offset);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findById(id: number): Promise<PurchaseInvoice | undefined> {
    const db = await getDb();
    const result = await db
      .select({
        id: purchaseInvoices.id,
        supplierId: purchaseInvoices.supplierId,
        invoiceNumber: purchaseInvoices.invoiceNumber,
        subtotal: purchaseInvoices.subtotal,
        discount: purchaseInvoices.discount,
        totalAmount: purchaseInvoices.totalAmount,
        paidAmount: purchaseInvoices.paidAmount,
        dueAmount: purchaseInvoices.dueAmount,
        notes: purchaseInvoices.notes,
        purchaseDate: purchaseInvoices.purchaseDate,
        createdAt: purchaseInvoices.createdAt,
        updatedAt: purchaseInvoices.updatedAt,
        supplierName: suppliers.name,
      })
      .from(purchaseInvoices)
      .leftJoin(suppliers, eq(purchaseInvoices.supplierId, suppliers.id))
      .where(eq(purchaseInvoices.id, id))
      .limit(1);

    return result[0];
  },

  async search(query: string): Promise<PurchaseInvoice[]> {
    const db = await getDb();
    return db
      .select({
        id: purchaseInvoices.id,
        supplierId: purchaseInvoices.supplierId,
        invoiceNumber: purchaseInvoices.invoiceNumber,
        subtotal: purchaseInvoices.subtotal,
        discount: purchaseInvoices.discount,
        totalAmount: purchaseInvoices.totalAmount,
        paidAmount: purchaseInvoices.paidAmount,
        dueAmount: purchaseInvoices.dueAmount,
        notes: purchaseInvoices.notes,
        purchaseDate: purchaseInvoices.purchaseDate,
        createdAt: purchaseInvoices.createdAt,
        updatedAt: purchaseInvoices.updatedAt,
        supplierName: suppliers.name,
      })
      .from(purchaseInvoices)
      .leftJoin(suppliers, eq(purchaseInvoices.supplierId, suppliers.id))
      .where(like(purchaseInvoices.invoiceNumber, `%${query}%`))
      .orderBy(desc(purchaseInvoices.purchaseDate))
      .limit(20);
  },

  async create(input: {
    supplierId: number;
    invoiceNumber: string;
    subtotal: number;
    discount: number;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    notes: string | null;
    purchaseDate: string;
  }): Promise<PurchaseInvoice> {
    const db = await getDb();
    const result = await db
      .insert(purchaseInvoices)
      .values(input)
      .returning();

    return result[0];
  },

  async update(
    id: number,
    input: { paidAmount: number; dueAmount: number }
  ): Promise<PurchaseInvoice | undefined> {
    const db = await getDb();
    const result = await db
      .update(purchaseInvoices)
      .set({ ...input, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(purchaseInvoices.id, id))
      .returning();

    return result[0];
  },
};
