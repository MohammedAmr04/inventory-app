import { create } from "zustand";

interface LedgerStore {
  selectedSupplierId: number | null;
  page: number;
  setSelectedSupplierId: (id: number | null) => void;
  setPage: (page: number) => void;
}

export const useLedgerStore = create<LedgerStore>((set) => ({
  selectedSupplierId: null,
  page: 1,
  setSelectedSupplierId: (id) => set({ selectedSupplierId: id, page: 1 }),
  setPage: (page) => set({ page }),
}));
