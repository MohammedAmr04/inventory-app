"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePurchasesStore } from "../stores/purchases-store";
import type { CreatePurchaseInvoiceInput } from "../types";

const PURCHASES_KEY = ["purchases"] as const;

function buildUrl(filters: ReturnType<typeof usePurchasesStore.getState>["filters"]) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.supplierId) params.set("supplierId", String(filters.supplierId));
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  return `/api/purchases?${params.toString()}`;
}

async function fetchAll(filters: ReturnType<typeof usePurchasesStore.getState>["filters"]) {
  const res = await fetch(buildUrl(filters));
  if (!res.ok) throw new Error("Failed to fetch purchases");
  return res.json();
}

async function fetchById(id: number) {
  const res = await fetch(`/api/purchases?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch purchase");
  return res.json();
}

async function searchPurchases(query: string) {
  const res = await fetch(`/api/purchases?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search purchases");
  return res.json();
}

async function createPurchase(input: CreatePurchaseInvoiceInput) {
  const res = await fetch("/api/purchases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create purchase");
  }
  return res.json();
}

export function usePurchases() {
  const queryClient = useQueryClient();
  const filters = usePurchasesStore((s) => s.filters);

  const { data, isLoading, error } = useQuery({
    queryKey: [...PURCHASES_KEY, filters],
    queryFn: () => fetchAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PURCHASES_KEY });
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

export function usePurchase(id: number | null) {
  return useQuery({
    queryKey: [...PURCHASES_KEY, id],
    queryFn: () => fetchById(id!),
    enabled: id !== null,
  });
}

export function usePurchaseSearch() {
  return useMutation({
    mutationFn: (query: string) => searchPurchases(query),
  });
}
