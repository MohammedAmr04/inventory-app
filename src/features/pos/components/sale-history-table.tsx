"use client";

import Link from "next/link";
import { useSaleHistory } from "../hooks";
import type { SaleFilters, SaleInvoice } from "../types";
import { Badge } from "@/components/ui/badge";

interface SaleHistoryTableProps {
  filters: SaleFilters;
}

const paymentBadge: Record<string, string> = {
  cash: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  card: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  mixed: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
};

export function SaleHistoryTable({ filters }: SaleHistoryTableProps) {
  const { data, loading, error } = useSaleHistory(filters);

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-destructive">{error}</div>;
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">No sales found</div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b text-left">
            <th className="px-4 py-3 font-medium">Invoice #</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Method</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(data.items as SaleInvoice[]).map((invoice) => (
            <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{invoice.invoiceNumber}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">{invoice.customerName ?? "—"}</td>
              <td className="px-4 py-3 font-medium">
                ${invoice.netTotal.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  className={paymentBadge[invoice.paymentMethod] ?? ""}
                  variant="outline"
                >
                  {invoice.paymentMethod}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/pos/invoices/${invoice.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            Page {data.page} of {data.totalPages}
          </span>
          <span>{data.total} total invoices</span>
        </div>
      )}
    </div>
  );
}
