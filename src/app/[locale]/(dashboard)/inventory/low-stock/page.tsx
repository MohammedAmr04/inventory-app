"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { useLowStock } from "@/features/inventory/hooks/use-low-stock";
import { LowStockCard } from "@/features/inventory/components/low-stock-card";
import { LoadingState, EmptyState, ErrorState } from "@/components/feedback";
import type { Product } from "@/features/inventory/types";

export default function LowStockPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useLowStock(page, 20);

  const products: Product[] = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Low Stock"
        description="Products that need restocking"
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : products.length === 0 ? (
        <EmptyState title="No low stock items" message="All products are well-stocked" />
      ) : (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <LowStockCard key={product.id} product={product} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.totalPages}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-accent disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
