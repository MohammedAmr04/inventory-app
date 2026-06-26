import { z } from "zod";

export const createUnitSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  symbol: z.string().min(1, "Symbol is required"),
});

export const updateUnitSchema = z.object({
  name: z.string().min(1).optional(),
  symbol: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  barcode: z.string().optional(),
  type: z.enum(["physical", "service"]),
  categoryId: z.number().nullable().optional(),
  unitId: z.number().nullable().optional(),
  costPrice: z.number().min(0, "Cost price must be >= 0"),
  salePrice: z.number().min(0, "Sale price must be >= 0"),
  stock: z.number().min(0).optional(),
  lowStockThreshold: z.number().min(0).optional(),
  description: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  barcode: z.string().optional(),
  type: z.enum(["physical", "service"]).optional(),
  categoryId: z.number().nullable().optional(),
  unitId: z.number().nullable().optional(),
  costPrice: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  lowStockThreshold: z.number().min(0).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createStockAdjustmentSchema = z.object({
  productId: z.number().min(1, "Product is required"),
  type: z.enum(["increase", "decrease", "set"]),
  quantity: z.number().min(0, "Quantity must be >= 0"),
  reason: z.string().optional(),
});
