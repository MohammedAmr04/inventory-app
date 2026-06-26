"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { PurchaseForm } from "@/features/purchases/components/purchase-form";
import { usePurchases } from "@/features/purchases/hooks/use-purchases";
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";
import { useProducts } from "@/features/inventory/hooks/use-products";
import type { CreatePurchaseInvoiceInput } from "@/features/purchases/types";

export default function NewPurchasePage() {
  const router = useRouter();
  const { create } = usePurchases();
  const { data: suppliersData } = useSuppliers();
  const { data: productsData } = useProducts();

  const handleSubmit = useCallback(
    async (input: CreatePurchaseInvoiceInput) => {
      await create(input);
      router.push("/purchases");
    },
    [create, router],
  );

  return (
    <div>
      <PageHeader title="New Purchase" description="Create a new purchase invoice" />
      <PurchaseForm
        suppliers={suppliersData?.items ?? []}
        products={productsData?.items ?? []}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/purchases")}
      />
    </div>
  );
}
