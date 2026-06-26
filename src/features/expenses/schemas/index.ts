import { z } from "zod";

export const createExpenseCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
});

export const updateExpenseCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export const createExpenseSchema = z.object({
  categoryId: z.number().positive("Category is required"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(500),
  notes: z.string().max(1000).optional(),
  expenseDate: z.string().optional(),
});

export const updateExpenseSchema = z.object({
  categoryId: z.number().positive().optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(500).optional(),
  notes: z.string().max(1000).optional(),
  expenseDate: z.string().optional(),
});
