"use client";

import { PageHeader } from "@/components/layouts/page-header";
import { PurchaseFilters } from "@/features/purchases/components/purchase-filters";
import { PurchaseInvoicesTable } from "@/features/purchases/components/purchase-invoices-table";
import { usePurchaseHistory } from "@/features/purchases/hooks/use-purchase-history";
import { usePurchasesStore } from "@/features/purchases/stores/purchases-store";

export default function PurchaseHistoryPage() {
  const { purchases, total, loading, error, filters } = usePurchaseHistory();
  const setFilters = usePurchasesStore((s) => s.setFilters);

  return (
    <div>
      <PageHeader title="History" description="Purchase invoice history" />
      <div className="mb-4">
        <PurchaseFilters />
      </div>
      <PurchaseInvoicesTable
        invoices={purchases}
        loading={loading}
        error={error}
        total={total}
        page={filters.page ?? 1}
        pageSize={filters.pageSize ?? 20}
        totalPages={Math.ceil(total / (filters.pageSize ?? 20))}
        onView={() => {}}
        onPageChange={(page: number) => setFilters({ page })}
      />
    </div>
  );
}
