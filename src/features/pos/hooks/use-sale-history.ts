"use client";

import { useQuery } from "@tanstack/react-query";
import type { SaleFilters } from "../types";

function buildUrl(filters: SaleFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.paymentMethod) params.set("paymentMethod", filters.paymentMethod);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  return `/api/pos/history?${params.toString()}`;
}

async function fetchHistory(filters: SaleFilters) {
  const res = await fetch(buildUrl(filters));
  if (!res.ok) throw new Error("Failed to fetch sales history");
  return res.json();
}

export function useSaleHistory(filters: SaleFilters) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sale-history", filters],
    queryFn: () => fetchHistory(filters),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
