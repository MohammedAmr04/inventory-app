"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchSale(id: number) {
  const res = await fetch(`/api/pos/invoices/${id}`);
  if (!res.ok) throw new Error("Failed to fetch sale");
  return res.json();
}

export function useSale(id: number | null) {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: () => fetchSale(id!),
    enabled: id !== null,
  });
}
