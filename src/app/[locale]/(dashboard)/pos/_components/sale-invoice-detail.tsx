"use client";

import { useSale } from "@/features/pos/hooks";
import type { SaleInvoice, InvoiceItem } from "@/features/pos/types";

interface SaleInvoiceDetailProps {
  id: number;
}

export function SaleInvoiceDetail({ id }: SaleInvoiceDetailProps) {
  const { data, isLoading, error } = useSale(id);

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-destructive">{String(error)}</div>;
  }

  if (!data) {
    return <div className="py-8 text-center text-muted-foreground">Invoice not found</div>;
  }

  const invoice = data as SaleInvoice & { items?: InvoiceItem[] };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{invoice.invoiceNumber}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(invoice.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${invoice.netTotal.toFixed(2)}</div>
            <div className="text-sm capitalize text-muted-foreground">
              {invoice.paymentMethod}
            </div>
          </div>
        </div>

        {invoice.customerName && (
          <div className="mb-4">
            <span className="text-sm text-muted-foreground">Customer: </span>
            <span className="font-medium">{invoice.customerName}</span>
          </div>
        )}

        <div className="mb-4 grid grid-cols-3 gap-4 border-t pt-4 text-sm">
          <div>
            <span className="text-muted-foreground">Subtotal</span>
            <div className="font-medium">${invoice.subtotal.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Discount</span>
            <div className="font-medium">-${invoice.discount.toFixed(2)}</div>
          </div>
          {invoice.cashReceived != null && (
            <div>
              <span className="text-muted-foreground">Cash Received</span>
              <div className="font-medium">${invoice.cashReceived.toFixed(2)}</div>
            </div>
          )}
          {invoice.changeAmount != null && invoice.changeAmount > 0 && (
            <div>
              <span className="text-muted-foreground">Change</span>
              <div className="font-medium text-green-600">
                ${invoice.changeAmount.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>

      {invoice.items && invoice.items.length > 0 && (
        <div className="rounded-lg border bg-card">
          <div className="border-b px-6 py-3">
            <h3 className="font-semibold">Items</h3>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b text-left">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Qty</th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: InvoiceItem) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-6 py-3">
                      {item.productName ?? `Product #${item.productId}`}
                      {item.productBarcode && (
                        <div className="text-xs text-muted-foreground">
                          {item.productBarcode}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">${item.salePrice.toFixed(2)}</td>
                    <td className="px-6 py-3">{item.quantity}</td>
                    <td className="px-6 py-3 text-right font-medium">
                      ${item.lineTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
