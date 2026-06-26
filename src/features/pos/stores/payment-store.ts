import { create } from "zustand";
import type { PaymentMethod } from "../types";

interface PaymentStore {
  method: PaymentMethod;
  cashReceived: number;
  cardAmount: number;
  setMethod: (method: PaymentMethod) => void;
  setCashReceived: (amount: number) => void;
  setCardAmount: (amount: number) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  method: "cash",
  cashReceived: 0,
  cardAmount: 0,
  setMethod: (method) => set({ method }),
  setCashReceived: (amount) => set({ cashReceived: amount }),
  setCardAmount: (amount) => set({ cardAmount: amount }),
  reset: () => set({ method: "cash", cashReceived: 0, cardAmount: 0 }),
}));
