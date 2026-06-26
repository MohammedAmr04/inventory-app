import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.number().positive(),
  quantity: z.number().positive(),
  salePrice: z.number().min(0),
  lineTotal: z.number().min(0),
});

export const createSaleSchema = z.object({
  items: z.array(cartItemSchema).min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  discount: z.number().min(0).default(0),
  netTotal: z.number().min(0),
  paymentMethod: z.enum(["cash", "card", "mixed"]),
  cashReceived: z.number().min(0).optional(),
  customerName: z.string().max(200).optional(),
});
