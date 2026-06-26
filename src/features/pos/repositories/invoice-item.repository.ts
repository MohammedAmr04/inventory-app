import { getDb } from "@/lib/db";
import { invoiceItems, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { InvoiceItem } from "../types";

export const InvoiceItemRepository = {
  async findByInvoiceId(salesInvoiceId: number): Promise<InvoiceItem[]> {
    const db = await getDb();
    return db
      .select({
        id: invoiceItems.id,
        salesInvoiceId: invoiceItems.salesInvoiceId,
        productId: invoiceItems.productId,
        quantity: invoiceItems.quantity,
        salePrice: invoiceItems.salePrice,
        lineTotal: invoiceItems.lineTotal,
        createdAt: invoiceItems.createdAt,
        productName: products.name,
        productBarcode: products.barcode,
      })
      .from(invoiceItems)
      .leftJoin(products, eq(invoiceItems.productId, products.id))
      .where(eq(invoiceItems.salesInvoiceId, salesInvoiceId))
      .orderBy(invoiceItems.id);
  },

  async create(
    salesInvoiceId: number,
    items: { productId: number; quantity: number; salePrice: number; lineTotal: number }[]
  ): Promise<void> {
    const db = await getDb();
    await db.insert(invoiceItems).values(
      items.map((item) => ({
        salesInvoiceId,
        productId: item.productId,
        quantity: item.quantity,
        salePrice: item.salePrice,
        lineTotal: item.lineTotal,
      }))
    );
  },
};
