"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { useStockAdjustments } from "@/features/inventory/hooks/use-stock-adjustments";
import { StockAdjustmentForm } from "@/features/inventory/components/stock-adjustment-form";
import { LoadingState, EmptyState, ErrorState } from "@/components/feedback";
import type { CreateStockAdjustmentInput, StockAdjustment } from "@/features/inventory/types";
import { useProducts } from "@/features/inventory/hooks/use-products";

export default function StockAdjustmentsPage() {
  const { data, loading, error, create } = useStockAdjustments();
  const { data: productsData } = useProducts();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = useCallback(
    async (input: CreateStockAdjustmentInput) => {
      await create(input);
      setShowForm(false);
    },
    [create],
  );

  const products = productsData?.items ?? [];
  const adjustments = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Stock Adjustments"
        description="Adjust product stock levels"
        actions={
          !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              New Adjustment
            </button>
          ) : null
        }
      />

      {showForm && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Create Stock Adjustment</h2>
          <StockAdjustmentForm
            products={products}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : adjustments.length === 0 ? (
        <EmptyState
          title="No adjustments yet"
          action={
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              New Adjustment
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Quantity</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Previous</th>
                <th className="px-4 py-3 text-right text-sm font-medium">New</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Reason</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((adj: StockAdjustment) => (
                <tr key={adj.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{adj.productName ?? `Product #${adj.productId}`}</td>
                  <td className="px-4 py-3 text-sm capitalize">{adj.type}</td>
                  <td className="px-4 py-3 text-sm text-right">{adj.quantity}</td>
                  <td className="px-4 py-3 text-sm text-right">{adj.previousStock}</td>
                  <td className="px-4 py-3 text-sm text-right">{adj.newStock}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{adj.reason ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{adj.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
