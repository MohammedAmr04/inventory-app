import { getDb } from "@/lib/db";
import { expenses, expenseCategories } from "@/lib/db/schema";
import { eq, like, and, desc, asc, count, sql, type SQL } from "drizzle-orm";
import type { Expense, ExpenseFilters, PaginatedResult } from "../types";

export const ExpenseRepository = {
  async findAll(filters?: ExpenseFilters): Promise<PaginatedResult<Expense>> {
    const db = await getDb();
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [];

    if (filters?.search) {
      conditions.push(like(expenses.description, `%${filters.search}%`));
    }

    if (filters?.categoryId) {
      conditions.push(eq(expenses.categoryId, filters.categoryId));
    }

    if (filters?.dateFrom) {
      conditions.push(sql`${expenses.expenseDate} >= ${filters.dateFrom}`);
    }

    if (filters?.dateTo) {
      conditions.push(sql`${expenses.expenseDate} <= ${filters.dateTo}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortDirection = filters?.sortOrder === "desc" ? desc : asc;
    const sortColumn =
      filters?.sortBy === "amount" ? expenses.amount
      : filters?.sortBy === "createdAt" ? expenses.createdAt
      : expenses.expenseDate;

    const [totalResult] = await db
      .select({ count: count() })
      .from(expenses)
      .where(whereClause);

    const total = totalResult?.count ?? 0;

    const items = await db
      .select({
        id: expenses.id,
        categoryId: expenses.categoryId,
        amount: expenses.amount,
        description: expenses.description,
        notes: expenses.notes,
        expenseDate: expenses.expenseDate,
        createdAt: expenses.createdAt,
        updatedAt: expenses.updatedAt,
        categoryName: expenseCategories.name,
      })
      .from(expenses)
      .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
      .where(whereClause)
      .orderBy(sortDirection(sortColumn))
      .limit(pageSize)
      .offset(offset);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findById(id: number): Promise<Expense | undefined> {
    const db = await getDb();
    const result = await db
      .select({
        id: expenses.id,
        categoryId: expenses.categoryId,
        amount: expenses.amount,
        description: expenses.description,
        notes: expenses.notes,
        expenseDate: expenses.expenseDate,
        createdAt: expenses.createdAt,
        updatedAt: expenses.updatedAt,
        categoryName: expenseCategories.name,
      })
      .from(expenses)
      .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
      .where(eq(expenses.id, id))
      .limit(1);

    return result[0];
  },

  async create(input: {
    categoryId: number;
    amount: number;
    description: string;
    notes: string | null;
    expenseDate: string;
  }): Promise<Expense> {
    const db = await getDb();
    const result = await db
      .insert(expenses)
      .values(input)
      .returning();

    return result[0];
  },

  async update(id: number, input: {
    categoryId?: number;
    amount?: number;
    description?: string;
    notes?: string | null;
    expenseDate?: string;
  }): Promise<Expense | undefined> {
    const db = await getDb();
    const result = await db
      .update(expenses)
      .set({ ...input, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(expenses.id, id))
      .returning();

    return result[0];
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(expenses).where(eq(expenses.id, id));
  },

  async getStats(): Promise<{
    totalExpenses: number;
    categoryBreakdown: { categoryName: string | null; total: number; count: number }[];
    monthlyExpenses: { month: string; total: number }[];
    averageMonthly: number;
  }> {
    const db = await getDb();

    const [totalResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses);

    const totalExpenses = totalResult?.total ?? 0;

    const categoryBreakdown = await db
      .select({
        categoryName: expenseCategories.name,
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
        count: count(),
      })
      .from(expenses)
      .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
      .groupBy(expenses.categoryId);

    const monthlyExpenses = await db
      .select({
        month: sql<string>`strftime('%Y-%m', ${expenses.expenseDate})`,
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .groupBy(sql`strftime('%Y-%m', ${expenses.expenseDate})`)
      .orderBy(sql`strftime('%Y-%m', ${expenses.expenseDate})`);

    const monthsCount = monthlyExpenses.length || 1;
    const averageMonthly = totalExpenses / monthsCount;

    return { totalExpenses, categoryBreakdown, monthlyExpenses, averageMonthly };
  },
};
