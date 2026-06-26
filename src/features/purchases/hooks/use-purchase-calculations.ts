"use client";

import { useMemo } from "react";
import { PurchaseCalculationService } from "../services/purchase-calculation.service";
import type { CartItem } from "../types";

export function usePurchaseCalculations(items: CartItem[], discount: number = 0, paidAmount: number = 0) {
  return useMemo(() => {
    const subtotal = PurchaseCalculationService.calculateSubtotal(items);
    const totalAmount = PurchaseCalculationService.calculateTotalAmount(subtotal, discount);
    const dueAmount = PurchaseCalculationService.calculateDueAmount(totalAmount, paidAmount);

    return { subtotal, totalAmount, dueAmount };
  }, [items, discount, paidAmount]);
}
