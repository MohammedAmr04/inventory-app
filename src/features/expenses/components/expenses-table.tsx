"use client";

import { useExpensesStore } from "../stores";
import { useExpenses } from "../hooks";
import { Button } from "@/components/ui/button";
import type { Expense } from "../types";

interface ExpensesTableProps {
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: number) => void;
}

export function ExpensesTable({ onEdit, onDelete }: ExpensesTableProps) {
  const setFilters = useExpensesStore((s) => s.setFilters);
  const { data, loading, error, isDeleting } = useExpenses();

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-destructive">{error}</div>;
  }

  if (!data || data.items.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No expenses found</div>;
  }

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b text-left">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="w-24 px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((expense: Expense) => (
            <tr key={expense.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(expense.expenseDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">{expense.categoryName ?? `#${expense.categoryId}`}</td>
              <td className="max-w-xs truncate px-4 py-3">{expense.description}</td>
              <td className="px-4 py-3 text-right font-medium">
                ${expense.amount.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => onDelete(expense.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>Page {data.page} of {data.totalPages}</span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1}
              onClick={() => setFilters({ page: data.page - 1 })}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages}
              onClick={() => setFilters({ page: data.page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
