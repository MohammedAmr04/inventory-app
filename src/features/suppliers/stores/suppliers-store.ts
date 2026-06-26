import { create } from "zustand";
import type { SupplierFilters } from "../types";

interface SuppliersStore {
  filters: SupplierFilters;
  setFilters: (filters: Partial<SupplierFilters>) => void;
  resetFilters: () => void;
}

export const useSuppliersStore = create<SuppliersStore>((set) => ({
  filters: { page: 1, pageSize: 20, sortBy: "name", sortOrder: "asc" },
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () =>
    set({ filters: { page: 1, pageSize: 20, sortBy: "name", sortOrder: "asc" } }),
}));
