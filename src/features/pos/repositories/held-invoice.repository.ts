import { getDb } from "@/lib/db";
import { heldInvoices, heldInvoiceItems, products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { HeldInvoice, HeldInvoiceItem } from "../types";

export const HeldInvoiceRepository = {
  async findAll(): Promise<HeldInvoice[]> {
    const db = await getDb();
    return db
      .select()
      .from(heldInvoices)
      .orderBy(desc(heldInvoices.createdAt));
  },

  async findById(id: number): Promise<HeldInvoice | undefined> {
    const db = await getDb();
    const result = await db
      .select()
      .from(heldInvoices)
      .where(eq(heldInvoices.id, id))
      .limit(1);

    return result[0];
  },

  async create(input: {
    referenceNumber: string;
    subtotal: number;
    discount: number;
    tax: number;
    netTotal: number;
  }): Promise<HeldInvoice> {
    const db = await getDb();
    const result = await db
      .insert(heldInvoices)
      .values(input)
      .returning();

    return result[0];
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.delete(heldInvoices).where(eq(heldInvoices.id, id));
  },

  async findItemsByHeldInvoiceId(heldInvoiceId: number): Promise<HeldInvoiceItem[]> {
    const db = await getDb();
    return db
      .select({
        id: heldInvoiceItems.id,
        heldInvoiceId: heldInvoiceItems.heldInvoiceId,
        productId: heldInvoiceItems.productId,
        quantity: heldInvoiceItems.quantity,
        salePrice: heldInvoiceItems.salePrice,
        lineTotal: heldInvoiceItems.lineTotal,
        createdAt: heldInvoiceItems.createdAt,
        productName: products.name,
      })
      .from(heldInvoiceItems)
      .leftJoin(products, eq(heldInvoiceItems.productId, products.id))
      .where(eq(heldInvoiceItems.heldInvoiceId, heldInvoiceId));
  },

  async createItems(
    heldInvoiceId: number,
    items: { productId: number; quantity: number; salePrice: number; lineTotal: number }[]
  ): Promise<void> {
    const db = await getDb();
    await db.insert(heldInvoiceItems).values(
      items.map((item) => ({
        heldInvoiceId,
        productId: item.productId,
        quantity: item.quantity,
        salePrice: item.salePrice,
        lineTotal: item.lineTotal,
      }))
    );
  },

  async deleteItemsByHeldInvoiceId(heldInvoiceId: number): Promise<void> {
    const db = await getDb();
    await db
      .delete(heldInvoiceItems)
      .where(eq(heldInvoiceItems.heldInvoiceId, heldInvoiceId));
  },
};
