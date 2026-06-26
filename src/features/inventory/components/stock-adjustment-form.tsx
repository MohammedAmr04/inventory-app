"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStockAdjustmentSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateStockAdjustmentInput, Product } from "../types";

interface StockAdjustmentFormProps {
  products: Product[];
  onSubmit: (data: CreateStockAdjustmentInput) => Promise<void>;
  onCancel: () => void;
}

export function StockAdjustmentForm({ products, onSubmit, onCancel }: StockAdjustmentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateStockAdjustmentInput>({
    resolver: zodResolver(createStockAdjustmentSchema),
    defaultValues: {
      productId: 0,
      type: "increase",
      quantity: 0,
      reason: "",
    },
  });

  const selectedProductId = watch("productId");
  const selectedProduct = products.find((p) => p.id === Number(selectedProductId));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label>Product</Label>
        <Select
          defaultValue="0"
          onValueChange={(value) => setValue("productId", Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Select a product</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name} (Stock: {product.stock})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.productId && (
          <p className="text-sm text-destructive">{errors.productId.message}</p>
        )}
        {selectedProduct && (
          <p className="text-sm text-muted-foreground">
            Current stock: {selectedProduct.stock}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label>Adjustment Type</Label>
        <Select
          defaultValue="increase"
          onValueChange={(value) =>
            setValue("type", value as "increase" | "decrease" | "set")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="increase">Increase</SelectItem>
            <SelectItem value="decrease">Decrease</SelectItem>
            <SelectItem value="set">Set</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          step="0.01"
          {...register("quantity", { valueAsNumber: true })}
        />
        {errors.quantity && (
          <p className="text-sm text-destructive">{errors.quantity.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="reason">Reason</Label>
        <textarea
          id="reason"
          {...register("reason")}
          className="flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          rows={2}
          placeholder="Optional reason for adjustment"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Apply Adjustment"}
        </Button>
      </div>
    </form>
  );
}
