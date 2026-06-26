"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePosStore, useCartStore, usePaymentStore } from "../stores";
import { useSales } from "../hooks";
import { PAYMENT_METHODS } from "../constants";
import { useTranslations } from "next-intl";

export function PaymentDialog() {
  const t = useTranslations();
  const show = usePosStore((s) => s.showPaymentDialog);
  const closePaymentDialog = usePosStore((s) => s.closePaymentDialog);
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);
  const discount = useCartStore((s) => s.discount);
  const { method, cashReceived, cardAmount, setMethod, setCashReceived, setCardAmount, reset } =
    usePaymentStore();

  const { create, isCreating } = useSales({
    page: 1,
    pageSize: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const netTotal = Math.max(0, subtotal - discount);
  const change =
    method === "cash"
      ? Math.max(0, cashReceived - netTotal)
      : method === "mixed"
        ? Math.max(0, cashReceived - (netTotal - cardAmount))
        : 0;

  const handlePay = useCallback(async () => {
    try {
      await create({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          salePrice: i.salePrice,
          lineTotal: i.lineTotal,
        })),
        subtotal,
        discount,
        netTotal,
        paymentMethod: method,
        cashReceived: method !== "card" ? cashReceived : undefined,
      });
      clearCart();
      reset();
      closePaymentDialog();
    } catch {
      // error handled by hook
    }
  }, [create, items, subtotal, discount, netTotal, method, cashReceived, clearCart, reset, closePaymentDialog]);

  function handleClose() {
    reset();
    closePaymentDialog();
  }

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settle Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <span className="text-3xl font-bold">${netTotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            {PAYMENT_METHODS.map((pm) => (
              <Button
                key={pm.value}
                variant={method === pm.value ? "default" : "outline"}
                className="flex-1"
                onClick={() => setMethod(pm.value)}
              >
                {t(pm.labelKey)}
              </Button>
            ))}
          </div>

          {method !== "card" && (
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Cash Received</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={cashReceived}
                onChange={(e) => setCashReceived(Number(e.target.value))}
                placeholder="0.00"
                className="text-lg"
                autoFocus
              />
            </div>
          )}

          {method === "mixed" && (
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Card Amount</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={cardAmount}
                onChange={(e) => setCardAmount(Number(e.target.value))}
                placeholder="0.00"
                className="text-lg"
              />
            </div>
          )}

          {change > 0 && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <span className="text-sm text-muted-foreground">Change Due</span>
              <div className="text-2xl font-bold text-green-600">
                ${change.toFixed(2)}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel (Esc)
            </Button>
            <Button
              className="flex-1"
              disabled={isCreating || items.length === 0}
              onClick={handlePay}
            >
              {isCreating ? "Processing..." : `Pay $${netTotal.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
