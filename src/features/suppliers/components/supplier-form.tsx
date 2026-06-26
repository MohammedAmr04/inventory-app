"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSupplierSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateSupplierInput, UpdateSupplierInput, Supplier } from "../types";

interface Props {
  initialData?: Supplier;
  onSubmit: (data: CreateSupplierInput | UpdateSupplierInput) => Promise<void>;
  onCancel: () => void;
}

export function SupplierForm({ initialData, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      phone: initialData.phone ?? "",
      email: initialData.email ?? "",
      address: initialData.address ?? "",
      notes: initialData.notes ?? "",
    } : { name: "", phone: "", email: "", address: "", notes: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input {...register("name")} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input {...register("phone")} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input {...register("email")} type="email" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Address</label>
        <Input {...register("address")} />
      </div>
      <div>
        <label className="text-sm font-medium">Notes</label>
        <Input {...register("notes")} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
