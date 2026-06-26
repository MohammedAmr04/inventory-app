"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import { PurchaseFilters } from "@/features/purchases/components/purchase-filters";
import { PurchaseInvoicesTable } from "@/features/purchases/components/purchase-invoices-table";
import { usePurchases } from "@/features/purchases/hooks/use-purchases";
import { usePurchasesStore } from "@/features/purchases/stores/purchases-store";
import type { PurchaseInvoice } from "@/features/purchases/types";

export default function PurchasesPage() {
  const router = useRouter();
  const { data, loading, error } = usePurchases();
  const setFilters = usePurchasesStore((s) => s.setFilters);

  return (
    <div>
      <PageHeader
        title="Purchases"
        description="Manage purchase invoices"
        actions={
          <Button onClick={() => router.push("/purchases/new")}>
            New Purchase
          </Button>
        }
      />
      <div className="mb-4">
        <PurchaseFilters />
      </div>
      <PurchaseInvoicesTable
        invoices={data?.items ?? []}
        loading={loading}
        error={error}
        total={data?.total ?? 0}
        page={data?.page ?? 1}
        pageSize={data?.pageSize ?? 20}
        totalPages={data?.totalPages ?? 1}
        onView={(invoice: PurchaseInvoice) => router.push(`/purchases/${invoice.id}`)}
        onPageChange={(page: number) => setFilters({ page })}
      />
    </div>
  );
}
