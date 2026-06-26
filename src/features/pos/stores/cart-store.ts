import { create } from "zustand";
import type { CartItem } from "../types";

interface CartStore {
  items: CartItem[];
  discount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updatePrice: (productId: number, price: number) => void;
  setDiscount: (discount: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  discount: 0,
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? {
                  ...i,
                  quantity: i.quantity + item.quantity,
                  lineTotal: (i.quantity + item.quantity) * i.salePrice,
                }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? { ...i, quantity, lineTotal: quantity * i.salePrice }
          : i
      ),
    })),
  updatePrice: (productId, salePrice) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? { ...i, salePrice, lineTotal: i.quantity * salePrice }
          : i
      ),
    })),
  setDiscount: (discount) => set({ discount }),
  clearCart: () => set({ items: [], discount: 0 }),
}));
