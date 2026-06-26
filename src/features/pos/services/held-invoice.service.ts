import { getDb } from "@/lib/db";
import { heldInvoices, heldInvoiceItems, products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { CreateHeldInvoiceInput, HeldInvoice, HeldInvoiceItem } from "../types";

export const HeldInvoiceService = {
  async findAll(): Promise<HeldInvoice[]> {
    const db = await getDb();
    return db
      .select()
      .from(heldInvoices)
      .orderBy(desc(heldInvoices.createdAt));
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

  async hold(input: CreateHeldInvoiceInput): Promise<HeldInvoice> {
    const db = await getDb();

    return db.transaction(async (tx) => {
      const refNumber = `HLD-${Date.now().toString(36).toUpperCase()}`;

      const [held] = await tx
        .insert(heldInvoices)
        .values({
          referenceNumber: refNumber,
          subtotal: input.subtotal,
          discount: input.discount,
          tax: 0,
          netTotal: input.netTotal,
        })
        .returning();

      await tx.insert(heldInvoiceItems).values(
        input.items.map((item) => ({
          heldInvoiceId: held.id,
          productId: item.productId,
          quantity: item.quantity,
          salePrice: item.salePrice,
          lineTotal: item.lineTotal,
        }))
      );

      return held;
    });
  },

  async resume(
    id: number
  ): Promise<HeldInvoice & { items: (HeldInvoiceItem & { productName: string | null })[] }> {
    const db = await getDb();

    return db.transaction(async (tx) => {
      const [held] = await tx
        .select()
        .from(heldInvoices)
        .where(eq(heldInvoices.id, id))
        .limit(1);

      if (!held) throw new Error("Held invoice not found");

      const items = await tx
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
        .where(eq(heldInvoiceItems.heldInvoiceId, id));

      await tx.delete(heldInvoiceItems).where(eq(heldInvoiceItems.heldInvoiceId, id));
      await tx.delete(heldInvoices).where(eq(heldInvoices.id, id));

      return { ...held, items };
    });
  },
};
