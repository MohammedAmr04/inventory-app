"use client";

import { useParams } from "next/navigation";
import { usePurchase, usePurchaseItems } from "@/features/purchases/hooks";
import { PurchaseDetailsCard } from "@/features/purchases/components/purchase-details-card";
import { PurchaseItemsTable } from "@/features/purchases/components/purchase-items-table";
import { PurchaseSummaryCard } from "@/features/purchases/components/purchase-summary-card";
import { LoadingState, ErrorState } from "@/components/feedback";
import type { PurchaseInvoice, PurchaseItem } from "@/features/purchases/types";

export default function PurchaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const invoiceId = Number(id);

  const {
    data: invoice,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = usePurchase(invoiceId);

  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = usePurchaseItems(invoiceId);

  if (invoiceLoading || itemsLoading) return <LoadingState />;
  if (invoiceError) return <ErrorState message={(invoiceError as Error).message} />;
  if (itemsError) return <ErrorState message={(itemsError as Error).message} />;
  if (!invoice) return <ErrorState message="Purchase invoice not found" />;

  const purchaseInvoice = invoice as unknown as PurchaseInvoice;
  const purchaseItems = (items as unknown as PurchaseItem[]) ?? [];

  return (
    <div className="space-y-6">
      <PurchaseDetailsCard invoice={purchaseInvoice} />
      <PurchaseItemsTable items={purchaseItems} />
      <PurchaseSummaryCard
        subtotal={purchaseInvoice.subtotal}
        discount={purchaseInvoice.discount}
        totalAmount={purchaseInvoice.totalAmount}
        paidAmount={purchaseInvoice.paidAmount}
        dueAmount={purchaseInvoice.dueAmount}
      />
    </div>
  );
}
