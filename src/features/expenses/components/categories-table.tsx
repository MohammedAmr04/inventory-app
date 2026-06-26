"use client";

import { useExpenseCategories } from "../hooks";
import { Button } from "@/components/ui/button";
import type { ExpenseCategory } from "../types";

interface CategoriesTableProps {
  onEdit?: (category: ExpenseCategory) => void;
}

export function CategoriesTable({ onEdit }: CategoriesTableProps) {
  const { data: categories, loading, error } = useExpenseCategories();

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-destructive">{error}</div>;
  }

  if (categories.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No categories found</div>;
  }

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b text-left">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="w-24 px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat: ExpenseCategory) => (
            <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{cat.name}</td>
              <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                {cat.description ?? "—"}
              </td>
              <td className="px-4 py-3">
                <span className={cat.isActive ? "text-green-600" : "text-muted-foreground"}>
                  {cat.isActive ? "Active" : "Archived"}
                </span>
              </td>
              <td className="px-4 py-3">
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(cat)}>
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
