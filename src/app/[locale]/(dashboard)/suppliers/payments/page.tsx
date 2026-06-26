"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { useSupplierPayments } from "@/features/suppliers/hooks/use-supplier-payments";
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";
import { PaymentForm } from "@/features/suppliers/components/payment-form";
import { LoadingState, EmptyState, ErrorState } from "@/components/feedback";
import type { SupplierPayment } from "@/features/suppliers/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function PaymentsPage() {
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { data: suppliers } = useSuppliers();
  const { data: payments, loading, error, create } = useSupplierPayments(
    selectedSupplierId ?? undefined,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Payments"
        description="View and manage payments"
        actions={
          <Button onClick={() => setShowForm(true)} disabled={!selectedSupplierId}>
            New Payment
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <Select
          value={selectedSupplierId ? String(selectedSupplierId) : ""}
          onValueChange={(value) => setSelectedSupplierId(value ? Number(value) : null)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All suppliers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All suppliers</SelectItem>
            {(suppliers?.items ?? []).map((s: { id: number; name: string }) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showForm && selectedSupplierId && (
        <div className="max-w-lg">
          <PaymentForm
            supplierId={selectedSupplierId}
            onSubmit={async (data) => {
              await create(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (!payments || payments.items.length === 0) && (
        <EmptyState title="No payments found" />
      )}
      {!loading && !error && payments && payments.items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.items.map((payment: SupplierPayment) => (
              <TableRow key={payment.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  {payment.supplierName ?? `Supplier #${payment.supplierId}`}
                </TableCell>
                <TableCell className="text-right">
                  {payment.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.notes ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
