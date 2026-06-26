import { create } from "zustand";
import type { ProductFilters } from "../types";

interface InventoryState {
  productFilters: ProductFilters;
  selectedProductId: number | null;
  setProductFilters: (filters: Partial<ProductFilters>) => void;
  resetProductFilters: () => void;
  setSelectedProductId: (id: number | null) => void;
}

const defaultFilters: ProductFilters = {
  search: "",
  categoryId: null,
  type: null,
  isActive: true,
  page: 1,
  pageSize: 20,
};

export const useInventoryStore = create<InventoryState>()((set) => ({
  productFilters: { ...defaultFilters },
  selectedProductId: null,
  setProductFilters: (filters) =>
    set((state) => ({
      productFilters: { ...state.productFilters, ...filters },
    })),
  resetProductFilters: () => set({ productFilters: { ...defaultFilters } }),
  setSelectedProductId: (id) => set({ selectedProductId: id }),
}));
