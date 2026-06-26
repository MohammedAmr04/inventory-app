"use client";

import { useRef, useCallback } from "react";
import {
  SearchBar,
  CartTable,
  CartSummaryCard,
  PaymentDialog,
  HeldInvoicesSheet,
  ShortcutBar,
} from "@/features/pos/components";
import { usePosStore, useCartStore } from "@/features/pos/stores";
import { useHeldInvoices } from "@/features/pos/hooks";
import { useKeyboardShortcuts } from "@/features/pos/hooks";

export function PosScreen() {
  const searchRef = useRef<HTMLInputElement>(null);
  const openPaymentDialog = usePosStore((s) => s.openPaymentDialog);
  const openHeldInvoices = usePosStore((s) => s.openHeldInvoices);
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);

  const { hold } = useHeldInvoices();

  const handleHold = useCallback(async () => {
    if (items.length === 0) return;
    try {
      const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
      await hold({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          salePrice: i.salePrice,
          lineTotal: i.lineTotal,
        })),
        subtotal,
        discount: 0,
        netTotal: subtotal,
      });
      clearCart();
    } catch {
      // handled by hook
    }
  }, [items, hold, clearCart]);

  const handleClear = useCallback(() => {
    if (window.confirm("Clear entire cart?")) {
      clearCart();
    }
  }, [clearCart]);

  useKeyboardShortcuts({
    onFocusSearch: () => searchRef.current?.focus(),
    onHold: handleHold,
    onClear: handleClear,
    onSettle: () => {
      if (items.length > 0) openPaymentDialog();
    },
    onClose: () => {
      // close any open dialog
    },
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <div className="flex flex-1 flex-col gap-4">
          <SearchBar inputRef={searchRef} />
          <div className="flex-1 overflow-auto rounded-lg border bg-card">
            <CartTable />
          </div>
        </div>
        <div className="w-80 shrink-0">
          <div className="flex h-full flex-col gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleHold}
                disabled={items.length === 0}
                className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
              >
                Hold (F2)
              </button>
              <button
                type="button"
                onClick={openHeldInvoices}
                className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
              >
                Held
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={items.length === 0}
                className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
              >
                Clear (F4)
              </button>
            </div>
            <div className="flex-1">
              <CartSummaryCard />
            </div>
          </div>
        </div>
      </div>

      <ShortcutBar />

      <PaymentDialog />
      <HeldInvoicesSheet />
    </div>
  );
}
