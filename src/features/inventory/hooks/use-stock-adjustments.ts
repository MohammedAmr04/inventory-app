"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateStockAdjustmentInput } from "../types";

const ADJUSTMENTS_KEY = ["stock-adjustments"] as const;

async function fetchAll(page = 1, pageSize = 20) {
  const res = await fetch(`/api/inventory/stock-adjustments?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch stock adjustments");
  return res.json();
}

async function createAdjustment(input: CreateStockAdjustmentInput) {
  const res = await fetch("/api/inventory/stock-adjustments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create stock adjustment");
  }
  return res.json();
}

export function useStockAdjustments(page = 1, pageSize = 20) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [...ADJUSTMENTS_KEY, page, pageSize],
    queryFn: () => fetchAll(page, pageSize),
  });

  const createMutation = useMutation({
    mutationFn: createAdjustment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADJUSTMENTS_KEY }),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
  };
}
