import { create } from "zustand";
import type { ExpenseFilters } from "../types";

interface ExpensesStore {
  filters: ExpenseFilters;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  resetFilters: () => void;
}

export const useExpensesStore = create<ExpensesStore>((set) => ({
  filters: { page: 1, pageSize: 20, sortBy: "expenseDate", sortOrder: "desc" },
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () =>
    set({ filters: { page: 1, pageSize: 20, sortBy: "expenseDate", sortOrder: "desc" } }),
}));
