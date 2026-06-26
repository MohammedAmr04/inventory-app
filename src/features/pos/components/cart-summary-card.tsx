"use client";

import { useCartStore, usePosStore } from "../stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CartSummaryCard() {
  const items = useCartStore((s) => s.items);
  const discount = useCartStore((s) => s.discount);
  const setDiscount = useCartStore((s) => s.setDiscount);
  const openPaymentDialog = usePosStore((s) => s.openPaymentDialog);

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const netTotal = Math.max(0, subtotal - discount);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Discount</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="ml-auto h-8 w-24 text-right"
          />
        </div>
        <div className="flex justify-between border-t pt-2 text-lg font-bold">
          <span>Total</span>
          <span>${netTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={items.length === 0}
        onClick={openPaymentDialog}
      >
        Settle Payment (F12)
      </Button>
    </div>
  );
}
