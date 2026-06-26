"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { useSupplier } from "@/features/suppliers/hooks/use-supplier";
import { SupplierDetailsCard } from "@/features/suppliers/components/supplier-details-card";
import { SupplierBalanceCard } from "@/features/suppliers/components/supplier-balance-card";
import { useSupplierLedger } from "@/features/suppliers/hooks/use-supplier-ledger";
import { SupplierLedgerTable } from "@/features/suppliers/components/supplier-ledger-table";
import { useSupplierPayments } from "@/features/suppliers/hooks/use-supplier-payments";
import { PaymentForm } from "@/features/suppliers/components/payment-form";
import { Button } from "@/components/ui/button";
import { LoadingState, ErrorState } from "@/components/feedback";

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supplierId = Number(id);
  const { supplier, loading, error } = useSupplier(supplierId);
  const { data: ledgerData, loading: ledgerLoading, error: ledgerError } = useSupplierLedger(supplierId);
  const { create: createPayment } = useSupplierPayments(supplierId);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!supplier) return <ErrorState message="Supplier not found" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={supplier.name}
        description="Supplier details and ledger"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <SupplierDetailsCard supplier={supplier} />
        <SupplierBalanceCard balance={supplier.currentBalance} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payments</h2>
          {!showPaymentForm && (
            <Button onClick={() => setShowPaymentForm(true)}>
              Record Payment
            </Button>
          )}
        </div>
        {showPaymentForm && (
          <div className="mb-6 max-w-lg">
            <PaymentForm
              supplierId={supplierId}
              onSubmit={async (data) => {
                await createPayment(data);
                setShowPaymentForm(false);
              }}
              onCancel={() => setShowPaymentForm(false)}
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Ledger</h2>
        <SupplierLedgerTable
          entries={ledgerData?.items ?? []}
          loading={ledgerLoading}
          error={ledgerError}
        />
      </div>
    </div>
  );
}
