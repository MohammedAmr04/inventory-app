"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReportFilters } from "../types";

async function fetchSalesReport(filters?: ReportFilters) {
  const params = new URLSearchParams();
  if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.set("dateTo", filters.dateTo);
  const qs = params.toString();
  const res = await fetch(`/api/reports/sales${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch sales report");
  return res.json();
}

export function useSalesReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: ["report-sales", filters],
    queryFn: () => fetchSalesReport(filters),
  });
}
