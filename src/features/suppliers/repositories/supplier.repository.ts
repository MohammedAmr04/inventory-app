import { getDb } from "@/lib/db";
import { suppliers, supplierPayments } from "@/lib/db/schema";
import { eq, like, and, or, desc, asc, count, sql, type SQL } from "drizzle-orm";
import type { Supplier, CreateSupplierInput, UpdateSupplierInput, SupplierFilters, PaginatedResult } from "../types";

export const SupplierRepository = {
  async findAll(filters?: SupplierFilters): Promise<PaginatedResult<Supplier>> {
    const db = await getDb();
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [eq(suppliers.isActive, true)];

    if (filters?.search) {
      conditions.push(like(suppliers.name, `%${filters.search}%`));
    }

    const whereClause = and(...conditions);

    const sortColumn = filters?.sortBy ?? "name";
    const sortDirection = filters?.sortOrder === "desc" ? desc : asc;
    const orderByMap = {
      name: suppliers.name,
      currentBalance: suppliers.currentBalance,
      createdAt: suppliers.createdAt,
    } as const;

    const [totalResult] = await db
      .select({ count: count() })
      .from(suppliers)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const items = await db
      .select()
      .from(suppliers)
      .where(whereClause)
      .orderBy(sortDirection(orderByMap[sortColumn] ?? suppliers.name))
      .limit(pageSize)
      .offset(offset);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findById(id: number): Promise<Supplier | undefined> {
    const db = await getDb();
    const result = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, id))
      .limit(1);

    return result[0];
  },

  async search(query: string): Promise<Supplier[]> {
    const db = await getDb();
    const searchCondition = or(
      like(suppliers.name, `%${query}%`),
      like(suppliers.phone, `%${query}%`),
    );

    return db
      .select()
      .from(suppliers)
      .where(and(eq(suppliers.isActive, true), searchCondition))
      .orderBy(suppliers.name)
      .limit(20);
  },

  async create(input: CreateSupplierInput): Promise<Supplier> {
    const db = await getDb();
    const result = await db.insert(suppliers).values(input).returning();
    return result[0];
  },

  async update(id: number, input: UpdateSupplierInput): Promise<Supplier | undefined> {
    const db = await getDb();
    const result = await db
      .update(suppliers)
      .set({ ...input, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(suppliers.id, id))
      .returning();

    return result[0];
  },

  async archive(id: number): Promise<void> {
    const db = await getDb();
    await db
      .update(suppliers)
      .set({ isActive: false, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(suppliers.id, id));
  },

  async findTopDebtors(limit = 10): Promise<(Supplier & { totalPurchases: number })[]> {
    const db = await getDb();

    const results = await db
      .select({
        id: suppliers.id,
        name: suppliers.name,
        phone: suppliers.phone,
        email: suppliers.email,
        address: suppliers.address,
        notes: suppliers.notes,
        currentBalance: suppliers.currentBalance,
        isActive: suppliers.isActive,
        createdAt: suppliers.createdAt,
        updatedAt: suppliers.updatedAt,
        totalPurchases: sql<number>`CAST(COALESCE(SUM(${supplierPayments.amount}), 0) AS REAL)`,
      })
      .from(suppliers)
      .leftJoin(supplierPayments, eq(suppliers.id, supplierPayments.supplierId))
      .where(eq(suppliers.isActive, true))
      .groupBy(suppliers.id)
      .orderBy(desc(suppliers.currentBalance))
      .limit(limit);

    return results;
  },
};
