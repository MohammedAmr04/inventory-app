"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchProductReport() {
  const res = await fetch("/api/reports/products");
  if (!res.ok) throw new Error("Failed to fetch product report");
  return res.json();
}

export function useProductReport() {
  return useQuery({
    queryKey: ["report-products"],
    queryFn: fetchProductReport,
  });
}
