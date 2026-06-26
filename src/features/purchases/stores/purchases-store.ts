import { create } from "zustand";
import type { PurchaseFilters } from "../types";

interface PurchasesStore {
  filters: PurchaseFilters;
  setFilters: (filters: Partial<PurchaseFilters>) => void;
  resetFilters: () => void;
}

export const usePurchasesStore = create<PurchasesStore>((set) => ({
  filters: { page: 1, pageSize: 20, sortBy: "purchaseDate", sortOrder: "desc" },
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () =>
    set({ filters: { page: 1, pageSize: 20, sortBy: "purchaseDate", sortOrder: "desc" } }),
}));
