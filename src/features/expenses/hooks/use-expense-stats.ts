"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchStats() {
  const res = await fetch("/api/expenses/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function useExpenseStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["expense-stats"],
    queryFn: fetchStats,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
