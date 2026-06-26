import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, inArray, and, sql } from "drizzle-orm";
import { logger } from "@/lib/logger";
import type { CreateSaleInput, SaleInvoice } from "../types";
import { SalesInvoiceRepository, InvoiceItemRepository } from "../repositories";

function generateInvoiceNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `POS-${date}-${seq}`;
}

export const PosService = {
  async createSale(input: CreateSaleInput): Promise<SaleInvoice> {
    const db = await getDb();

    const invoiceNumber = generateInvoiceNumber();
    const productIds = input.items.map((i) => i.productId);

    return db.transaction(async (tx) => {
      const physicalProducts = await tx
        .select({ id: products.id, stock: products.stock })
        .from(products)
        .where(and(inArray(products.id, productIds), eq(products.type, "physical")));

      for (const item of input.items) {
        const physical = physicalProducts.find((p) => p.id === item.productId);
        if (physical) {
          const newStock = physical.stock - item.quantity;
          if (newStock < 0) {
            throw new Error(
              `Insufficient stock for product #${item.productId}. Available: ${physical.stock}, requested: ${item.quantity}`
            );
          }
          await tx
            .update(products)
            .set({ stock: sql`${products.stock} - ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
      }

      const invoice = await SalesInvoiceRepository.create({
        invoiceNumber,
        customerName: input.customerName ?? null,
        subtotal: input.subtotal,
        discount: input.discount,
        tax: 0,
        netTotal: input.netTotal,
        paymentMethod: input.paymentMethod,
        cashReceived: input.cashReceived ?? null,
        changeAmount:
          input.paymentMethod === "cash" || input.paymentMethod === "mixed"
            ? (input.cashReceived ?? 0) - input.netTotal
            : null,
      });

      await InvoiceItemRepository.create(
        invoice.id,
        input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          salePrice: item.salePrice,
          lineTotal: item.lineTotal,
        }))
      );

      logger.info("Sale created", {
        id: invoice.id,
        invoiceNumber,
        netTotal: input.netTotal,
        paymentMethod: input.paymentMethod,
      });

      return invoice;
    });
  },
};
