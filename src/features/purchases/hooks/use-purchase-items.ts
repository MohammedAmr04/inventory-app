"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchItems(invoiceId: number) {
  const res = await fetch(`/api/purchases/items?invoiceId=${invoiceId}`);
  if (!res.ok) throw new Error("Failed to fetch purchase items");
  return res.json();
}

export function usePurchaseItems(invoiceId: number | null) {
  return useQuery({
    queryKey: ["purchase-items", invoiceId],
    queryFn: () => fetchItems(invoiceId!),
    enabled: invoiceId !== null,
  });
}
