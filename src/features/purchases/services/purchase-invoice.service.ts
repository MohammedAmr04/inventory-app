import { getDb } from "@/lib/db";
import {
  purchaseInvoices,
  purchaseItems,
  products,
  suppliers,
  supplierLedger,
} from "@/lib/db/schema";
import { eq, sql, inArray, and } from "drizzle-orm";
import { logger } from "@/lib/logger";
import type {
  PurchaseInvoice,
  PurchaseFilters,
  PaginatedResult,
  CreatePurchaseInvoiceInput,
} from "../types";
import { PurchaseInvoiceRepository } from "../repositories";
import { PurchaseCalculationService } from "./purchase-calculation.service";

export const PurchaseInvoiceService = {
  async getAll(filters?: PurchaseFilters): Promise<PaginatedResult<PurchaseInvoice>> {
    return PurchaseInvoiceRepository.findAll(filters);
  },

  async getById(id: number): Promise<PurchaseInvoice | undefined> {
    return PurchaseInvoiceRepository.findById(id);
  },

  async search(query: string): Promise<PurchaseInvoice[]> {
    return PurchaseInvoiceRepository.search(query);
  },

  async create(input: CreatePurchaseInvoiceInput): Promise<PurchaseInvoice> {
    const totalAmount = PurchaseCalculationService.calculateTotalAmount(
      input.subtotal,
      input.discount ?? 0
    );
    const dueAmount = PurchaseCalculationService.calculateDueAmount(
      totalAmount,
      input.paidAmount ?? 0
    );

    const db = await getDb();

    return db.transaction(async (tx) => {
      const [invoice] = await tx
        .insert(purchaseInvoices)
        .values({
          supplierId: input.supplierId,
          invoiceNumber: input.invoiceNumber,
          subtotal: input.subtotal,
          discount: input.discount ?? 0,
          totalAmount,
          paidAmount: input.paidAmount ?? 0,
          dueAmount,
          notes: input.notes ?? null,
          purchaseDate: input.purchaseDate ?? new Date().toISOString(),
        })
        .returning();

      const productIds = input.items.map((item) => item.productId);

      const physicalProducts = await tx
        .select({ id: products.id })
        .from(products)
        .where(and(inArray(products.id, productIds), eq(products.type, "physical")));

      const physicalProductIds = new Set(physicalProducts.map((p) => p.id));

      for (const item of input.items) {
        await tx.insert(purchaseItems).values({
          purchaseInvoiceId: invoice.id,
          productId: item.productId,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
          lineTotal: item.lineTotal,
        });

        if (physicalProductIds.has(item.productId)) {
          await tx
            .update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
      }

      if (dueAmount > 0) {
        await tx
          .update(suppliers)
          .set({ currentBalance: sql`${suppliers.currentBalance} + ${dueAmount}` })
          .where(eq(suppliers.id, input.supplierId));

        const [supplier] = await tx
          .select({ currentBalance: suppliers.currentBalance })
          .from(suppliers)
          .where(eq(suppliers.id, input.supplierId))
          .limit(1);

        await tx.insert(supplierLedger).values({
          supplierId: input.supplierId,
          referenceType: "purchase_invoice",
          referenceId: invoice.id,
          amount: dueAmount,
          balanceAfter: supplier?.currentBalance ?? dueAmount,
          description: `Purchase invoice ${input.invoiceNumber}`,
        });
      }

      logger.info("Purchase invoice created", {
        id: invoice.id,
        invoiceNumber: input.invoiceNumber,
        totalAmount,
        dueAmount,
      });

      return invoice;
    });
  },
};
