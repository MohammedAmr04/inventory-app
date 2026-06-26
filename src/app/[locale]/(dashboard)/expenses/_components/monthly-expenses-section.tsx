"use client";

import { useExpenseStats } from "@/features/expenses/hooks";

export function MonthlyExpensesSection() {
  const { data: stats, loading, error } = useExpenseStats();

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (error || !stats) {
    return <div className="py-8 text-center text-destructive">{error}</div>;
  }

  if (stats.monthlyExpenses.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">No expenses recorded yet</div>;
  }

  const maxAmount = Math.max(...stats.monthlyExpenses.map((m: any) => m.total), 1);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b text-left">
                <th className="px-6 py-3 font-medium">Month</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Bar</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthlyExpenses.map((m: any) => (
                <tr key={m.month} className="border-b last:border-0">
                  <td className="px-6 py-3 font-medium">{m.month}</td>
                  <td className="px-6 py-3">${Number(m.total).toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <div className="h-4 w-full rounded bg-muted">
                      <div
                        className="h-full rounded bg-primary"
                        style={{ width: `${(Number(m.total) / maxAmount) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
