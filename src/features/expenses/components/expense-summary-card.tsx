"use client";

import { useExpenseStats } from "../hooks";

export function ExpenseSummaryCard() {
  const { data: stats, loading, error } = useExpenseStats();

  if (loading) {
    return <div className="rounded-lg border bg-card p-6">
      <div className="text-sm text-muted-foreground">Loading statistics...</div>
    </div>;
  }

  if (error || !stats) {
    return null;
  }

  const cards = [
    { label: "Total Expenses", value: `$${stats.totalExpenses.toFixed(2)}` },
    { label: "Monthly Average", value: `$${stats.averageMonthly.toFixed(2)}` },
    { label: "Categories Used", value: String(stats.categoryBreakdown.length) },
    { label: "Months Active", value: String(stats.monthlyExpenses.length) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">{card.label}</div>
          <div className="mt-1 text-2xl font-bold">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
