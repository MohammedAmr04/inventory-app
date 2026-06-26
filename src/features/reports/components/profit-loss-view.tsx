"use client";

import { useProfitLoss } from "../hooks";
import type { ReportFilters } from "../types";

interface ProfitLossViewProps {
  filters?: ReportFilters;
}

export function ProfitLossView({ filters }: ProfitLossViewProps) {
  const { data, isLoading, error } = useProfitLoss(filters);

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading profit & loss...</div>;
  }

  if (error || !data) {
    return <div className="py-8 text-center text-destructive">Failed to load profit & loss</div>;
  }

  const rows = [
    { label: "Total Revenue", value: data.totalRevenue, type: "revenue" },
    { label: "Cost of Goods Sold (COGS)", value: data.cogs, type: "cost" },
    { label: "Gross Profit", value: data.grossProfit, type: "profit", margin: data.grossMargin },
    { label: "Operating Expenses", value: data.operatingExpenses, type: "cost" },
    { label: "Net Profit", value: data.netProfit, type: "profit", margin: data.netMargin },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-2 font-semibold">Profit & Loss Statement</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Period: {data.period.from} — {data.period.to}
        </p>
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <span className="text-sm">{row.label}</span>
              <div className="text-right">
                <span
                  className={`font-bold ${
                    row.type === "revenue"
                      ? "text-green-600"
                      : row.type === "cost"
                        ? "text-red-600"
                        : row.value >= 0
                          ? "text-green-600"
                          : "text-red-600"
                  }`}
                >
                  ${row.value.toFixed(2)}
                </span>
                {row.margin !== undefined && (
                  <div className="text-xs text-muted-foreground">
                    {row.margin.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Gross Margin</div>
          <div className={`mt-1 text-2xl font-bold ${data.grossMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
            {data.grossMargin.toFixed(1)}%
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Net Margin</div>
          <div className={`mt-1 text-2xl font-bold ${data.netMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
            {data.netMargin.toFixed(1)}%
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Expense Ratio</div>
          <div className="mt-1 text-2xl font-bold text-orange-600">
            {data.totalRevenue > 0 ? ((data.operatingExpenses / data.totalRevenue) * 100).toFixed(1) : "0.0"}%
          </div>
        </div>
      </div>
    </div>
  );
}
