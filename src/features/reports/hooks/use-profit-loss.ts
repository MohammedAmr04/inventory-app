"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReportFilters } from "../types";

async function fetchProfitLoss(filters?: ReportFilters) {
  const params = new URLSearchParams();
  if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.set("dateTo", filters.dateTo);
  const qs = params.toString();
  const res = await fetch(`/api/reports/profit-loss${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch profit/loss");
  return res.json();
}

export function useProfitLoss(filters?: ReportFilters) {
  return useQuery({
    queryKey: ["report-profit-loss", filters],
    queryFn: () => fetchProfitLoss(filters),
  });
}
