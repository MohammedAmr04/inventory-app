"use client";

import { usePurchasesStore } from "../stores/purchases-store";
import { usePurchases } from "./use-purchases";

export function usePurchaseHistory() {
  const filters = usePurchasesStore((s) => s.filters);
  const { data, loading, error } = usePurchases();

  return { purchases: data?.items ?? [], total: data?.total ?? 0, loading, error, filters };
}
