"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuppliersStore } from "../stores/suppliers-store";

export function SupplierFilters() {
  const { filters, setFilters } = useSuppliersStore();

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Input
          placeholder="Search suppliers..."
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
        />
      </div>
      <Select
        value={filters.sortBy ?? "name"}
        onValueChange={(value) =>
          setFilters({ sortBy: value as "name" | "currentBalance" | "createdAt", page: 1 })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="currentBalance">Balance</SelectItem>
          <SelectItem value="createdAt">Created</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.sortOrder ?? "asc"}
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
