"use client";

import { useDashboard } from "../hooks";

export function DashboardCards() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  if (error || !data) {
    return <div className="py-8 text-center text-destructive">Failed to load dashboard</div>;
  }

  const cards = [
    { label: "Today's Sales", value: `$${data.todaySales.toFixed(2)}`, positive: data.todaySales >= 0 },
    { label: "Today's Expenses", value: `$${data.todayExpenses.toFixed(2)}`, positive: false },
    { label: "Today's Profit", value: `$${data.todayProfit.toFixed(2)}`, positive: data.todayProfit >= 0 },
    { label: "Total Revenue", value: `$${data.totalRevenue.toFixed(2)}`, positive: true },
    { label: "Total Payables", value: `$${data.totalOutstandingPayables.toFixed(2)}`, positive: false },
    { label: "Products", value: String(data.totalProducts), positive: true },
    { label: "Low Stock Items", value: String(data.lowStockCount), positive: data.lowStockCount === 0 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">{card.label}</div>
          <div className={`mt-1 text-2xl font-bold ${card.positive ? "text-green-600" : "text-red-600"}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
