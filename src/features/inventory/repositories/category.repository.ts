import { getDb } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, like, and } from "drizzle-orm";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

export const CategoryRepository = {
  async findAll(): Promise<Category[]> {
    const db = await getDb();
    return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.name);
  },

  async findAllIncludingInactive(): Promise<Category[]> {
    const db = await getDb();
    return db.select().from(categories).orderBy(categories.name);
  },

  async findById(id: number): Promise<Category | undefined> {
    const db = await getDb();
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  },

  async search(query: string): Promise<Category[]> {
    const db = await getDb();
    return db
      .select()
      .from(categories)
      .where(and(eq(categories.isActive, true), like(categories.name, `%${query}%`)))
      .orderBy(categories.name);
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    const db = await getDb();
    const result = await db.insert(categories).values(input).returning();
    return result[0];
  },

  async update(id: number, input: UpdateCategoryInput): Promise<Category | undefined> {
    const db = await getDb();
    const result = await db.update(categories).set(input).where(eq(categories.id, id)).returning();
    return result[0];
  },

  async archive(id: number): Promise<void> {
    const db = await getDb();
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(categories).where(eq(categories.id, id));
  },
};
