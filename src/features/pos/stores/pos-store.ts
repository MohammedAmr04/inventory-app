import { create } from "zustand";

interface PosStore {
  searchQuery: string;
  showPaymentDialog: boolean;
  showHeldInvoices: boolean;
  showPrintDialog: boolean;
  setSearchQuery: (query: string) => void;
  openPaymentDialog: () => void;
  closePaymentDialog: () => void;
  openHeldInvoices: () => void;
  closeHeldInvoices: () => void;
  openPrintDialog: () => void;
  closePrintDialog: () => void;
}

export const usePosStore = create<PosStore>((set) => ({
  searchQuery: "",
  showPaymentDialog: false,
  showHeldInvoices: false,
  showPrintDialog: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  openPaymentDialog: () => set({ showPaymentDialog: true }),
  closePaymentDialog: () => set({ showPaymentDialog: false }),
  openHeldInvoices: () => set({ showHeldInvoices: true }),
  closeHeldInvoices: () => set({ showHeldInvoices: false }),
  openPrintDialog: () => set({ showPrintDialog: true }),
  closePrintDialog: () => set({ showPrintDialog: false }),
}));
