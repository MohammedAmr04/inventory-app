"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EmptyState, LoadingState, ErrorState } from "@/components/feedback";
import type { SupplierLedgerEntry } from "../types";

interface SupplierLedgerTableProps {
  entries: SupplierLedgerEntry[];
  loading: boolean;
  error: string | null;
}

function formatType(type: SupplierLedgerEntry["referenceType"]): string {
  switch (type) {
    case "purchase_invoice":
      return "Purchase";
    case "payment":
      return "Payment";
    case "manual_adjustment":
      return "Adjustment";
    default:
      return type;
  }
}

export function SupplierLedgerTable({ entries, loading, error }: SupplierLedgerTableProps) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (entries.length === 0) {
    return <EmptyState title="No ledger entries found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Balance After</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="text-muted-foreground">
              {new Date(entry.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="capitalize">{formatType(entry.referenceType)}</TableCell>
            <TableCell className="text-right">{entry.amount.toFixed(2)}</TableCell>
            <TableCell className="text-right">{entry.balanceAfter.toFixed(2)}</TableCell>
            <TableCell className="text-muted-foreground">{entry.description ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
