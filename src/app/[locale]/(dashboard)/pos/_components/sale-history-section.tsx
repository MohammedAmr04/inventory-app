"use client";

import { useState } from "react";
import { SaleHistoryTable } from "@/features/pos/components";
import { Input } from "@/components/ui/input";
import type { SaleFilters } from "@/features/pos/types";

export function SaleHistorySection() {
  const [filters, setFilters] = useState<SaleFilters>({
    page: 1,
    pageSize: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search invoices..."
          value={filters.search ?? ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
          className="max-w-xs"
        />
        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value, page: 1 }))}
          className="max-w-40"
        />
        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value, page: 1 }))}
          className="max-w-40"
        />
      </div>

      <SaleHistoryTable filters={filters} />
    </div>
  );
}
