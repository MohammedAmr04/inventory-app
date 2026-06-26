"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSupplierPaymentSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateSupplierPaymentInput } from "../types";

interface PaymentFormProps {
  supplierId: number;
  onSubmit: (data: CreateSupplierPaymentInput) => Promise<void>;
  onCancel: () => void;
}

function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function PaymentForm({ supplierId, onSubmit, onCancel }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplierPaymentInput>({
    resolver: zodResolver(createSupplierPaymentSchema),
    defaultValues: {
      supplierId,
      amount: 0,
      paymentDate: getTodayString(),
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("supplierId", { valueAsNumber: true })} />

      <div>
        <label className="text-sm font-medium">Amount</label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Payment Date</label>
        <Input type="date" {...register("paymentDate")} />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <Input {...register("notes")} placeholder="Optional notes" />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Record Payment"}
        </Button>
      </div>
    </form>
  );
}
