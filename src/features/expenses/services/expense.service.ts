import { ExpenseRepository } from "../repositories";
import type { Expense, CreateExpenseInput, UpdateExpenseInput, ExpenseFilters, PaginatedResult } from "../types";

export const ExpenseService = {
  async getAll(filters?: ExpenseFilters): Promise<PaginatedResult<Expense>> {
    return ExpenseRepository.findAll(filters);
  },

  async getById(id: number): Promise<Expense | undefined> {
    return ExpenseRepository.findById(id);
  },

  async create(input: CreateExpenseInput): Promise<Expense> {
    return ExpenseRepository.create({
      categoryId: input.categoryId,
      amount: input.amount,
      description: input.description,
      notes: input.notes ?? null,
      expenseDate: input.expenseDate ?? new Date().toISOString(),
    });
  },

  async update(id: number, input: UpdateExpenseInput): Promise<Expense | undefined> {
    return ExpenseRepository.update(id, {
      categoryId: input.categoryId,
      amount: input.amount,
      description: input.description,
      notes: input.notes ?? null,
      expenseDate: input.expenseDate,
    });
  },

  async delete(id: number): Promise<void> {
    return ExpenseRepository.delete(id);
  },

  async getStats() {
    return ExpenseRepository.getStats();
  },
};
