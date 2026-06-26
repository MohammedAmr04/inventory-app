import { create } from "zustand";

interface StockAdjustmentState {
  selectedProductId: number | null;
  page: number;
  setSelectedProductId: (id: number | null) => void;
  setPage: (page: number) => void;
}

export const useStockAdjustmentStore = create<StockAdjustmentState>()((set) => ({
  selectedProductId: null,
  page: 1,
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  setPage: (page) => set({ page }),
}));
