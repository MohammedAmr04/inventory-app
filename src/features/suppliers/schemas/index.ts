import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  phone: z.string().max(50).optional().or(z.literal("")),
  email: z.string().email().max(200).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export const updateSupplierSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  phone: z.string().max(50).optional().or(z.literal("")),
  email: z.string().email().max(200).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export const createSupplierPaymentSchema = z.object({
  supplierId: z.number().positive(),
  amount: z.number().positive("Amount must be positive"),
  paymentDate: z.string().optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});
