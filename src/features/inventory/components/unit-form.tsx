"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUnitSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateUnitInput, UpdateUnitInput, Unit } from "../types";

interface UnitFormProps {
  initialData?: Unit | null;
  onSubmit: (data: CreateUnitInput | UpdateUnitInput) => Promise<void>;
  onCancel: () => void;
}

export function UnitForm({ initialData, onSubmit, onCancel }: UnitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUnitInput>({
    resolver: zodResolver(createUnitSchema),
    defaultValues: initialData
      ? { name: initialData.name, symbol: initialData.symbol }
      : { name: "", symbol: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} placeholder="Piece" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="symbol">Symbol</Label>
        <Input id="symbol" {...register("symbol")} placeholder="pcs" />
        {errors.symbol && (
          <p className="text-sm text-destructive">{errors.symbol.message}</p>
        )}
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
