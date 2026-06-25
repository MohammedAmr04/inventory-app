import { getDb } from "../index";
import { settings } from "../schema";

export async function seedDatabase() {
  const db = await getDb();
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
