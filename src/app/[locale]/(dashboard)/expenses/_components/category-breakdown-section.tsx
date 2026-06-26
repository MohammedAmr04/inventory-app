"use client";

import { useExpenseStats } from "@/features/expenses/hooks";

export function CategoryBreakdownSection() {
  const { data: stats, loading, error } = useExpenseStats();

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (error || !stats || stats.categoryBreakdown.length === 0) {
    return null;
  }

  const maxAmount = Math.max(...stats.categoryBreakdown.map((c: any) => c.total), 1);

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 font-semibold">By Category</h3>
      <div className="space-y-3">
        {stats.categoryBreakdown.map((cat: any) => (
          <div key={cat.categoryName}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{cat.categoryName}</span>
              <span className="font-medium">${Number(cat.total).toFixed(2)} ({cat.count})</span>
            </div>
            <div className="h-3 w-full rounded bg-muted">
              <div
                className="h-full rounded bg-primary"
                style={{ width: `${(Number(cat.total) / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
