import { create } from "zustand";

interface PaymentsStore {
  selectedSupplierId: number | null;
  setSelectedSupplierId: (id: number | null) => void;
}

export const usePaymentsStore = create<PaymentsStore>((set) => ({
  selectedSupplierId: null,
  setSelectedSupplierId: (id) => set({ selectedSupplierId: id }),
}));
