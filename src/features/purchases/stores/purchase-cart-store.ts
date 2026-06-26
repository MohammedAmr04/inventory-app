import { create } from "zustand";
import type { CartItem } from "../types";

interface PurchaseCartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updatePrice: (productId: number, price: number) => void;
  clearCart: () => void;
}

export const usePurchaseCartStore = create<PurchaseCartStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity, lineTotal: (i.quantity + item.quantity) * i.purchasePrice }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity, lineTotal: quantity * i.purchasePrice } : i
      ),
    })),
  updatePrice: (productId, purchasePrice) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, purchasePrice, lineTotal: i.quantity * purchasePrice } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
}));
