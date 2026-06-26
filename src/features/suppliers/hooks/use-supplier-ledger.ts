"use client";

import { useQuery } from "@tanstack/react-query";

function buildUrl(supplierId: number, page: number, pageSize: number) {
  const params = new URLSearchParams();
  params.set("supplierId", String(supplierId));
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  return `/api/suppliers/ledger?${params.toString()}`;
}

async function fetchLedger(supplierId: number, page: number, pageSize: number) {
  const res = await fetch(buildUrl(supplierId, page, pageSize));
  if (!res.ok) throw new Error("Failed to fetch supplier ledger");
  return res.json();
}

export function useSupplierLedger(supplierId: number, page = 1, pageSize = 20) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["supplier-ledger", supplierId, page, pageSize],
    queryFn: () => fetchLedger(supplierId, page, pageSize),
    enabled: supplierId > 0,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
