"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "../schemas";
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
import type { CreateProductInput, UpdateProductInput, Product, Category, Unit } from "../types";

interface ProductFormProps {
  initialData?: Product | null;
  categories: Category[];
  units: Unit[];
  onSubmit: (data: CreateProductInput | UpdateProductInput) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initialData, categories, units, onSubmit, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          barcode: initialData.barcode ?? "",
          type: initialData.type,
          categoryId: initialData.categoryId,
          unitId: initialData.unitId,
          costPrice: initialData.costPrice,
          salePrice: initialData.salePrice,
          stock: initialData.stock,
          lowStockThreshold: initialData.lowStockThreshold ?? 0,
          description: initialData.description ?? "",
        }
      : {
          name: "",
          barcode: "",
          type: "physical",
          categoryId: null,
          unitId: null,
          costPrice: 0,
          salePrice: 0,
          stock: 0,
          lowStockThreshold: 0,
          description: "",
        },
  });

  const productType = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} placeholder="Product name" />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input id="barcode" {...register("barcode")} placeholder="Optional barcode" />
        </div>

        <div className="grid gap-2">
          <Label>Type</Label>
          <Select
            defaultValue={initialData?.type ?? "physical"}
            onValueChange={(value) => setValue("type", value as "physical" | "service")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physical">Physical</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Category</Label>
          <Select
            defaultValue={initialData?.categoryId?.toString() ?? ""}
            onValueChange={(value) => setValue("categoryId", value ? Number(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="No category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Unit</Label>
          <Select
            defaultValue={initialData?.unitId?.toString() ?? ""}
            onValueChange={(value) => setValue("unitId", value ? Number(value) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="No unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No unit</SelectItem>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id.toString()}>
                  {unit.name} ({unit.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="costPrice">Cost Price</Label>
          <Input
            id="costPrice"
            type="number"
            step="0.01"
            {...register("costPrice", { valueAsNumber: true })}
          />
          {errors.costPrice && (
            <p className="text-sm text-destructive">{errors.costPrice.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="salePrice">Sale Price</Label>
          <Input
            id="salePrice"
            type="number"
            step="0.01"
            {...register("salePrice", { valueAsNumber: true })}
          />
          {errors.salePrice && (
            <p className="text-sm text-destructive">{errors.salePrice.message}</p>
          )}
        </div>

        {productType === "physical" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input
                id="stock"
                type="number"
                step="0.01"
                {...register("stock", { valueAsNumber: true })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                step="0.01"
                {...register("lowStockThreshold", { valueAsNumber: true })}
              />
            </div>
          </>
        )}

        <div className="col-span-2 grid gap-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register("description")}
            className="flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            rows={3}
            placeholder="Optional description"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
