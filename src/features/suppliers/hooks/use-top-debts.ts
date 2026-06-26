"use client";

import { useQuery } from "@tanstack/react-query";
import type { SupplierAnalytics } from "../types";

async function fetchAnalytics(): Promise<SupplierAnalytics> {
  const res = await fetch("/api/suppliers/analytics");
  if (!res.ok) throw new Error("Failed to fetch supplier analytics");
  return res.json();
}

export function useTopDebts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["supplier-analytics"],
    queryFn: fetchAnalytics,
  });

  return {
    analytics: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
