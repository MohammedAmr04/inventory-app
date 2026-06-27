import { settings } from "../schema";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export async function seedDatabase(
  db: BetterSQLite3Database<typeof import("../schema")>
) {
  const existingSettings = await db.select().from(settings);

  if (existingSettings.length > 0) return;

  await db.insert(settings).values([
    { key: "currency", value: "USD" },
    { key: "tax_rate", value: "0" },
    { key: "theme", value: "light" },
    { key: "language", value: "en" },
    { key: "store_name", value: "My Store" },
  ]);
}
