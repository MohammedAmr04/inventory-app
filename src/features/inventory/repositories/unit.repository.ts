import { getDb } from "@/lib/db";
import { units } from "@/lib/db/schema";
import { eq, like, and } from "drizzle-orm";
import type { Unit, CreateUnitInput, UpdateUnitInput } from "../types";

export const UnitRepository = {
  async findAll(): Promise<Unit[]> {
    const db = await getDb();
    return db.select().from(units).where(eq(units.isActive, true)).orderBy(units.name);
  },

  async findAllIncludingInactive(): Promise<Unit[]> {
    const db = await getDb();
    return db.select().from(units).orderBy(units.name);
  },

  async findById(id: number): Promise<Unit | undefined> {
    const db = await getDb();
    const result = await db.select().from(units).where(eq(units.id, id)).limit(1);
    return result[0];
  },

  async search(query: string): Promise<Unit[]> {
    const db = await getDb();
    return db
      .select()
      .from(units)
      .where(and(eq(units.isActive, true), like(units.name, `%${query}%`)))
      .orderBy(units.name);
  },

  async create(input: CreateUnitInput): Promise<Unit> {
    const db = await getDb();
    const result = await db.insert(units).values(input).returning();
    return result[0];
  },

  async update(id: number, input: UpdateUnitInput): Promise<Unit | undefined> {
    const db = await getDb();
    const result = await db.update(units).set(input).where(eq(units.id, id)).returning();
    return result[0];
  },

  async archive(id: number): Promise<void> {
    const db = await getDb();
    await db.update(units).set({ isActive: false }).where(eq(units.id, id));
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(units).where(eq(units.id, id));
  },
};
