import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
}

export function PurchaseSummaryCard({
  subtotal,
  discount,
  totalAmount,
  paidAmount,
  dueAmount,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Discount</span>
          <span>{discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-sm font-semibold">
          <span>Total</span>
          <span>{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Paid</span>
          <span>{paidAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-sm font-semibold text-destructive">
          <span>Due</span>
          <span>{dueAmount.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
