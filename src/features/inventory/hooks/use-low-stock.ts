"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchLowStock(page = 1, pageSize = 20) {
  const res = await fetch(`/api/inventory/low-stock?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch low stock products");
  return res.json();
}

async function fetchLowStockCount() {
  const res = await fetch("/api/inventory/low-stock?count=true");
  if (!res.ok) throw new Error("Failed to fetch low stock count");
  const data = await res.json();
  return data.count;
}

export function useLowStock(page = 1, pageSize = 20) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["low-stock", page, pageSize],
    queryFn: () => fetchLowStock(page, pageSize),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}

export function useLowStockCount() {
  const { data: count = 0, isLoading } = useQuery({
    queryKey: ["low-stock-count"],
    queryFn: fetchLowStockCount,
  });

  return { count, loading: isLoading };
}
