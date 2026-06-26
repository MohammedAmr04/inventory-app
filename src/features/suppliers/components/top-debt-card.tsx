import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Supplier } from "../types";

interface TopDebtCardProps {
  supplier: Supplier & { totalPurchases: number };
}

export function TopDebtCard({ supplier }: TopDebtCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{supplier.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Debt Amount</span>
          <span className="text-lg font-bold text-destructive">
            {supplier.currentBalance.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Purchases</span>
          <span className="text-sm font-medium">
            {supplier.totalPurchases.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
