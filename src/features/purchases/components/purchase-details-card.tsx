import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PurchaseInvoice } from "../types";

interface Props {
  invoice: PurchaseInvoice;
}

export function PurchaseDetailsCard({ invoice }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Invoice #</p>
            <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Supplier</p>
            <p className="text-sm font-medium">{invoice.supplierName ?? "—"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-sm font-medium">
              {new Date(invoice.purchaseDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm font-medium">
              {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Notes</p>
          <p className="text-sm font-medium">{invoice.notes ?? "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
