"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSaleInput, SaleFilters } from "../types";

const SALES_KEY = ["sales"] as const;

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
  return `/api/pos?${params.toString()}`;
}

async function fetchAll(filters: SaleFilters) {
  const res = await fetch(buildUrl(filters));
  if (!res.ok) throw new Error("Failed to fetch sales");
  return res.json();
}

async function createSale(input: CreateSaleInput) {
  const res = await fetch("/api/pos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create sale");
  }
  return res.json();
}

export function useSales(filters: SaleFilters) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [...SALES_KEY, filters],
    queryFn: () => fetchAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_KEY });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
