import { getDb } from "@/lib/db";
import { expenseCategories } from "@/lib/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import type { ExpenseCategory, CreateExpenseCategoryInput, UpdateExpenseCategoryInput } from "../types";

export const ExpenseCategoryRepository = {
  async findAll(): Promise<ExpenseCategory[]> {
    const db = await getDb();
    return db
      .select()
      .from(expenseCategories)
      .orderBy(asc(expenseCategories.name));
  },

  async findById(id: number): Promise<ExpenseCategory | undefined> {
    const db = await getDb();
    const result = await db
      .select()
      .from(expenseCategories)
      .where(eq(expenseCategories.id, id))
      .limit(1);

    return result[0];
  },

  async create(input: CreateExpenseCategoryInput): Promise<ExpenseCategory> {
    const db = await getDb();
    const result = await db
      .insert(expenseCategories)
      .values(input)
      .returning();

    return result[0];
  },

  async update(id: number, input: UpdateExpenseCategoryInput): Promise<ExpenseCategory | undefined> {
    const db = await getDb();
    const result = await db
      .update(expenseCategories)
      .set({ ...input, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(expenseCategories.id, id))
      .returning();

    return result[0];
  },
};
