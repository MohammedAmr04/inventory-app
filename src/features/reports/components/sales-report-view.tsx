"use client";

import { useSalesReport } from "../hooks";
import type { ReportFilters } from "../types";

interface SalesReportViewProps {
  filters?: ReportFilters;
}

export function SalesReportView({ filters }: SalesReportViewProps) {
  const { data, isLoading, error } = useSalesReport(filters);

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading sales report...</div>;
  }

  if (error || !data) {
    return <div className="py-8 text-center text-destructive">Failed to load sales report</div>;
  }

  const maxDaily = Math.max(...data.dailySales.map((d: any) => Number(d.total)), 1);
  const maxMonthly = Math.max(...data.monthlySales.map((m: any) => Number(m.total)), 1);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 font-semibold">Daily Sales (Last 30 Days)</h3>
        <div className="space-y-2">
          {data.dailySales.map((d: any) => (
            <div key={d.date} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 text-muted-foreground">{d.date}</span>
              <div className="flex-1">
                <div className="h-5 rounded bg-muted">
                  <div
                    className="h-full rounded bg-primary"
                    style={{ width: `${(Number(d.total) / maxDaily) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-24 text-right font-medium">${Number(d.total).toFixed(2)}</span>
              <span className="w-16 text-right text-muted-foreground">{d.count} sales</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 font-semibold">Monthly Sales</h3>
        <div className="space-y-2">
          {data.monthlySales.map((m: any) => (
            <div key={m.month} className="flex items-center gap-3 text-sm">
              <span className="w-20 shrink-0 text-muted-foreground">{m.month}</span>
              <div className="flex-1">
                <div className="h-5 rounded bg-muted">
                  <div
                    className="h-full rounded bg-primary"
                    style={{ width: `${(Number(m.total) / maxMonthly) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-24 text-right font-medium">${Number(m.total).toFixed(2)}</span>
              <span className="w-16 text-right text-muted-foreground">{m.count} sales</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 font-semibold">Payment Methods</h3>
        <div className="space-y-2">
          {data.paymentMethodBreakdown.map((p: any) => (
            <div key={p.method} className="flex items-center justify-between text-sm">
              <span className="font-medium capitalize">{p.method}</span>
              <span className="text-muted-foreground">{p.count} transactions</span>
              <span className="font-medium">${Number(p.total).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
