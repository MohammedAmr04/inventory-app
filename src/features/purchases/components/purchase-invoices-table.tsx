"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState, EmptyState, ErrorState } from "@/components/feedback";
import type { PurchaseInvoice } from "../types";

interface Props {
  invoices: PurchaseInvoice[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onView: (invoice: PurchaseInvoice) => void;
  onPageChange: (page: number) => void;
}

function getStatusBadge(invoice: PurchaseInvoice) {
  if (invoice.dueAmount === 0) {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
  }
  if (invoice.paidAmount > 0 && invoice.dueAmount > 0) {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Partial</Badge>;
  }
  return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Credit</Badge>;
}

export function PurchaseInvoicesTable({
  invoices,
  loading,
  error,
  total,
  page,
  pageSize,
  totalPages,
  onView,
  onPageChange,
}: Props) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (invoices.length === 0) return <EmptyState title="No purchase invoices found" />;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Due</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="cursor-pointer"
              onClick={() => onView(invoice)}
            >
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell className="text-muted-foreground">
                {invoice.supplierName ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(invoice.purchaseDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">{invoice.totalAmount.toFixed(2)}</TableCell>
              <TableCell className="text-right">{invoice.paidAmount.toFixed(2)}</TableCell>
              <TableCell className="text-right">{invoice.dueAmount.toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(invoice)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
