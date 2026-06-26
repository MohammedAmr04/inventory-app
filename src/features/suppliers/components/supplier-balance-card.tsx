import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SupplierBalanceCardProps {
  balance: number;
}

export function SupplierBalanceCard({ balance }: SupplierBalanceCardProps) {
  const isDebt = balance > 0;
  const isSettled = balance === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isDebt
                ? "bg-destructive/10 text-destructive"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            }`}
          >
            {isDebt ? "!" : "✓"}
          </div>
          <div>
            <p
              className={`text-2xl font-bold ${
                isDebt
                  ? "text-destructive"
                  : isSettled
                    ? "text-emerald-600 dark:text-emerald-400"
                    : ""
              }`}
            >
              {balance.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {isDebt ? "Outstanding debt" : isSettled ? "Settled" : "Credit balance"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
