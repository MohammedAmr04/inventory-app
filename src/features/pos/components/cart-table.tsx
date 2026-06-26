"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartStore } from "../stores";

export function CartTable() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const updatePrice = useCartStore((s) => s.updatePrice);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Scan or search products to start
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 font-medium">Product</th>
            <th className="pb-2 font-medium">Price</th>
            <th className="pb-2 font-medium">Qty</th>
            <th className="pb-2 text-right font-medium">Total</th>
            <th className="w-10 pb-2" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId} className="border-b last:border-0">
              <td className="py-2">
                <div className="font-medium">{item.productName}</div>
                {item.barcode && (
                  <div className="text-xs text-muted-foreground">{item.barcode}</div>
                )}
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  step="0.01"
                  value={item.salePrice}
                  onChange={(e) =>
                    updatePrice(item.productId, Number(e.target.value))
                  }
                  className="h-8 w-20"
                />
              </td>
              <td className="py-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, Number(e.target.value))
                  }
                  className="h-8 w-16"
                />
              </td>
              <td className="py-2 text-right font-medium">
                ${item.lineTotal.toFixed(2)}
              </td>
              <td className="py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.productId)}
                >
                  ×
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
