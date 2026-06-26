"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePurchasesStore } from "../stores/purchases-store";

export function PurchaseFilters() {
  const { filters, setFilters } = usePurchasesStore();

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Input
          placeholder="Search by invoice number..."
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
        />
      </div>
      <div className="w-40">
        <Input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) => setFilters({ dateFrom: e.target.value, page: 1 })}
        />
      </div>
      <div className="w-40">
        <Input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => setFilters({ dateTo: e.target.value, page: 1 })}
        />
      </div>
      <Select
        value={filters.sortBy ?? "purchaseDate"}
        onValueChange={(value) =>
          setFilters({
            sortBy: value as "purchaseDate" | "totalAmount" | "createdAt",
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="purchaseDate">Date</SelectItem>
          <SelectItem value="totalAmount">Total</SelectItem>
          <SelectItem value="createdAt">Created</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.sortOrder ?? "desc"}
        onValueChange={(value) =>
          setFilters({ sortOrder: value as "asc" | "desc", page: 1 })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
