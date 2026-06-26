"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePosStore, useCartStore } from "../stores";
import { useHeldInvoices } from "../hooks";
import type { HeldInvoice } from "../types";

export function HeldInvoicesSheet() {
  const show = usePosStore((s) => s.showHeldInvoices);
  const closeHeldInvoices = usePosStore((s) => s.closeHeldInvoices);
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const { data: heldInvoices, resume, isResuming } = useHeldInvoices();

  async function handleResume(held: HeldInvoice) {
    try {
      const resumed = await resume(held.id);
      clearCart();
      if (resumed.items) {
        for (const item of resumed.items) {
          addItem({
            productId: item.productId,
            productName: item.productName ?? `Product #${item.productId}`,
            barcode: null,
            quantity: item.quantity,
            salePrice: item.salePrice,
            lineTotal: item.lineTotal,
          });
        }
      }
      closeHeldInvoices();
    } catch {
      // handled by hook
    }
  }

  return (
    <Sheet open={show} onOpenChange={(open) => !open && closeHeldInvoices()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Held Invoices</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {heldInvoices.length === 0 && (
            <p className="text-sm text-muted-foreground">No held invoices</p>
          )}
          {heldInvoices.map((held: HeldInvoice) => (
            <div
              key={held.id}
              className="rounded-lg border p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium">{held.referenceNumber}</span>
                <span className="text-sm font-bold">
                  ${held.netTotal.toFixed(2)}
                </span>
              </div>
              <div className="mb-2 text-xs text-muted-foreground">
                {new Date(held.createdAt).toLocaleString()}
              </div>
              <Button
                size="sm"
                className="w-full"
                disabled={isResuming}
                onClick={() => handleResume(held)}
              >
                Resume
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
