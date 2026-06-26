import { create } from "zustand";

interface HeldInvoicesStore {
  lastInvoiceId: number | null;
  setLastInvoiceId: (id: number | null) => void;
}

export const useHeldInvoicesStore = create<HeldInvoicesStore>((set) => ({
  lastInvoiceId: null,
  setLastInvoiceId: (id) => set({ lastInvoiceId: id }),
}));
