"use client";

import { useProductReport } from "../hooks";

export function ProductReportView() {
  const { data, isLoading, error } = useProductReport();

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading product report...</div>;
  }

  if (error || !data) {
    return <div className="py-8 text-center text-destructive">Failed to load product report</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 font-semibold">Top Selling Products</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b text-left">
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="px-4 py-2 text-right font-medium">Sold</th>
                <th className="px-4 py-2 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topSelling.map((p: any) => (
                <tr key={p.productId} className="border-b last:border-0">
                  <td className="px-4 py-2">{p.productName}</td>
                  <td className="px-4 py-2 text-right">{p.totalQuantity}</td>
                  <td className="px-4 py-2 text-right font-medium">${Number(p.totalRevenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 font-semibold">Most Profitable Products</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b text-left">
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="px-4 py-2 text-right font-medium">Profit</th>
                <th className="px-4 py-2 text-right font-medium">Margin</th>
              </tr>
            </thead>
            <tbody>
              {data.mostProfitable.map((p: any) => (
                <tr key={p.productId} className="border-b last:border-0">
                  <td className="px-4 py-2">{p.productName}</td>
                  <td className="px-4 py-2 text-right font-medium text-green-600">
                    ${Number(p.totalProfit).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right text-muted-foreground">
                    {Number(p.margin).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">Dead Stock ({data.deadStock.length})</h3>
          {data.deadStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">No dead stock items</p>
          ) : (
            <div className="space-y-2">
              {data.deadStock.slice(0, 10).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{p.daysSinceLastSale}d since last sale</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold">Low Stock ({data.lowStock.length})</h3>
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">No low stock items</p>
          ) : (
            <div className="space-y-2">
              {data.lowStock.slice(0, 10).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{p.stock} / {p.lowStockThreshold}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
