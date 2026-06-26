"use client";

import { PageHeader } from "@/components/layouts/page-header";
import { useTopDebts } from "@/features/suppliers/hooks/use-top-debts";
import { TopDebtCard } from "@/features/suppliers/components/top-debt-card";
import { LoadingState, EmptyState, ErrorState } from "@/components/feedback";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TopDebtsPage() {
  const { analytics, loading, error } = useTopDebts();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!analytics) return <EmptyState title="No data available" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Top Debts"
        description="Suppliers with the highest outstanding balances"
      />

      <Card>
        <CardHeader>
          <CardTitle>Total Outstanding Payables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-destructive">
            {analytics.totalOutstandingPayables.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {analytics.topDebtors.length === 0 ? (
        <EmptyState title="No debtors" message="All supplier balances are settled" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analytics.topDebtors.map((supplier) => (
            <TopDebtCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}
    </div>
  );
}
