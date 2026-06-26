"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { useSuppliers } from "@/features/suppliers/hooks/use-suppliers";
import { SuppliersTable } from "@/features/suppliers/components/suppliers-table";
import { SupplierForm } from "@/features/suppliers/components/supplier-form";
import { SupplierFilters } from "@/features/suppliers/components/supplier-filters";
import { useSuppliersStore } from "@/features/suppliers/stores/suppliers-store";
import { Button } from "@/components/ui/button";
import type { Supplier, CreateSupplierInput, UpdateSupplierInput } from "@/features/suppliers/types";

export default function SuppliersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { filters, setFilters } = useSuppliersStore();
  const { data, loading, error, create, update, archive } = useSuppliers();

  const handleCreate = async (input: CreateSupplierInput | UpdateSupplierInput) => {
    await create(input as CreateSupplierInput);
    setShowForm(false);
  };

  const handleUpdate = async (input: CreateSupplierInput | UpdateSupplierInput) => {
    if (!editingSupplier) return;
    await update(editingSupplier.id, input as UpdateSupplierInput);
    setEditingSupplier(null);
  };

  if (showForm || editingSupplier) {
    return (
      <div>
        <PageHeader title={editingSupplier ? "Edit Supplier" : "Add Supplier"} />
        <div className="max-w-lg">
          <SupplierForm
            initialData={editingSupplier ?? undefined}
            onSubmit={editingSupplier ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingSupplier(null); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Manage your suppliers"
        actions={<Button onClick={() => setShowForm(true)}>Add Supplier</Button>}
      />
      <div className="mb-4">
        <SupplierFilters />
      </div>
      <SuppliersTable
        suppliers={data?.items ?? []}
        loading={loading}
        error={error}
        total={data?.total ?? 0}
        page={filters.page ?? 1}
        pageSize={filters.pageSize ?? 20}
        totalPages={data?.totalPages ?? 1}
        onEdit={(supplier) => setEditingSupplier(supplier)}
        onArchive={(id) => archive(id)}
        onPageChange={(page) => setFilters({ page })}
        onAdd={() => setShowForm(true)}
      />
    </div>
  );
}
