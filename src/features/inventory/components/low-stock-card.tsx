"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "../types";

interface LowStockCardProps {
  product: Product;
}

export function LowStockCard({ product }: LowStockCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{product.name}</CardTitle>
            {product.barcode && (
              <CardDescription>{product.barcode}</CardDescription>
            )}
          </div>
          <Badge variant="destructive" className="text-base">{product.stock}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Threshold: {product.lowStockThreshold}
          </span>
          {product.categoryName && (
            <span className="text-muted-foreground">{product.categoryName}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
