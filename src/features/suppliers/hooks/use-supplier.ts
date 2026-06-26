"use client";

import { useQuery } from "@tanstack/react-query";
import type { Supplier } from "../types";

async function fetchSupplier(id: number): Promise<Supplier> {
  const res = await fetch(`/api/suppliers?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch supplier");
  return res.json();
}

export function useSupplier(id: number | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => fetchSupplier(id!),
    enabled: id !== null,
  });

  return {
    supplier: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
