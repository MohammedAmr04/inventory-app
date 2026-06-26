import { getDb } from "@/lib/db";
import { purchaseItems, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { PurchaseItem } from "../types";

export const PurchaseItemRepository = {
  async findByInvoiceId(invoiceId: number): Promise<PurchaseItem[]> {
    const db = await getDb();
    return db
      .select({
        id: purchaseItems.id,
        purchaseInvoiceId: purchaseItems.purchaseInvoiceId,
        productId: purchaseItems.productId,
        quantity: purchaseItems.quantity,
        purchasePrice: purchaseItems.purchasePrice,
        lineTotal: purchaseItems.lineTotal,
        createdAt: purchaseItems.createdAt,
        productName: products.name,
      })
      .from(purchaseItems)
      .leftJoin(products, eq(purchaseItems.productId, products.id))
      .where(eq(purchaseItems.purchaseInvoiceId, invoiceId))
      .orderBy(purchaseItems.id);
  },

  async create(input: {
    purchaseInvoiceId: number;
    productId: number;
    quantity: number;
    purchasePrice: number;
    lineTotal: number;
  }): Promise<PurchaseItem> {
    const db = await getDb();
    const result = await db
      .insert(purchaseItems)
      .values(input)
      .returning();

    return result[0];
  },

  async deleteByInvoiceId(invoiceId: number): Promise<void> {
    const db = await getDb();
    await db
      .delete(purchaseItems)
      .where(eq(purchaseItems.purchaseInvoiceId, invoiceId));
  },
};
