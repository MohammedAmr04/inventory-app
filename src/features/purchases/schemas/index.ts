import { z } from "zod";

export const createPurchaseItemSchema = z.object({
  productId: z.number().positive(),
  quantity: z.number().positive("Quantity must be positive"),
  purchasePrice: z.number().min(0, "Price cannot be negative"),
  lineTotal: z.number().min(0),
});

export const createPurchaseInvoiceSchema = z.object({
  supplierId: z.number().positive("Supplier is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  subtotal: z.number().min(0),
  discount: z.number().min(0).optional().default(0),
  paidAmount: z.number().min(0).optional().default(0),
  notes: z.string().max(1000).optional().or(z.literal("")),
  purchaseDate: z.string().optional(),
  items: z.array(createPurchaseItemSchema).min(1, "At least one item is required"),
});
