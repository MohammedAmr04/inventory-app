import { getDb } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { STORE_SETTINGS_KEYS, SETTINGS_KEYS, DEFAULT_STORE_SETTINGS, type StoreSettings } from "../types";

export class SettingsService {
  static async getAll(): Promise<StoreSettings> {
    const db = await getDb();
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, STORE_SETTINGS_KEYS));

    const map = new Map(rows.map((r) => [r.key, r.value]));

    return {
      storeName: map.get("store_name") ?? DEFAULT_STORE_SETTINGS.storeName,
      storePhone: map.get("store_phone") ?? DEFAULT_STORE_SETTINGS.storePhone,
      storeEmail: map.get("store_email") ?? DEFAULT_STORE_SETTINGS.storeEmail,
      storeAddress: map.get("store_address") ?? DEFAULT_STORE_SETTINGS.storeAddress,
      taxName: map.get("tax_name") ?? DEFAULT_STORE_SETTINGS.taxName,
      taxRate: Number(map.get("tax_rate")) ?? DEFAULT_STORE_SETTINGS.taxRate,
      currencySymbol: map.get("currency_symbol") ?? DEFAULT_STORE_SETTINGS.currencySymbol,
      currencyCode: map.get("currency_code") ?? DEFAULT_STORE_SETTINGS.currencyCode,
      receiptFooter: map.get("receipt_footer") ?? DEFAULT_STORE_SETTINGS.receiptFooter,
    };
  }

  static async update(data: Partial<StoreSettings>): Promise<void> {
    const db = await getDb();
    const entries = Object.entries(data).filter(([, v]) => v !== undefined);

    for (const [key, value] of entries) {
      const dbKey = SETTINGS_KEYS[key as keyof StoreSettings];
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, dbKey))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({
            value: String(value),
            updatedAt: new Date().toISOString(),
          })
          .where(eq(settings.key, dbKey));
      } else {
        await db.insert(settings).values({
          key: dbKey,
          value: String(value),
        });
      }
    }
  }
}
