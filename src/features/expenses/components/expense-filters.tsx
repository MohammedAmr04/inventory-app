"use client";

import { Input } from "@/components/ui/input";
import { useExpensesStore } from "../stores";
import { useExpenseCategories } from "../hooks";

export function ExpenseFilters() {
  const filters = useExpensesStore((s) => s.filters);
  const setFilters = useExpensesStore((s) => s.setFilters);
  const { data: categories } = useExpenseCategories();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search expenses..."
        value={filters.search ?? ""}
        onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
        className="max-w-xs"
      />
      <select
        value={filters.categoryId ?? ""}
        onChange={(e) => setFilters({ categoryId: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
      >
        <option value="">All categories</option>
        {categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <Input
        type="date"
        value={filters.dateFrom ?? ""}
        onChange={(e) => setFilters({ dateFrom: e.target.value, page: 1 })}
        className="max-w-36"
      />
      <Input
        type="date"
        value={filters.dateTo ?? ""}
        onChange={(e) => setFilters({ dateTo: e.target.value, page: 1 })}
        className="max-w-36"
      />
    </div>
  );
}
