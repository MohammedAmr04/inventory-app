import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { User, UserFormData } from "../types";

export class UserService {
  static async getAll(): Promise<User[]> {
    const db = await getDb();
    return db.select().from(users).orderBy(users.name) as Promise<User[]>;
  }

  static async create(data: UserFormData): Promise<User> {
    const db = await getDb();
    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        role: data.role,
      })
      .returning();
    return user as User;
  }

  static async update(id: number, data: Partial<UserFormData>): Promise<User> {
    const db = await getDb();
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, id))
      .returning();
    return user as User;
  }

  static async toggleActive(id: number): Promise<User> {
    const db = await getDb();
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .then((rows) => rows[0]) as User | undefined;
    if (!existing) throw new Error("User not found");

    const [user] = await db
      .update(users)
      .set({
        isActive: !existing.isActive,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, id))
      .returning();
    return user as User;
  }

  static async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(users).where(eq(users.id, id));
  }
}
