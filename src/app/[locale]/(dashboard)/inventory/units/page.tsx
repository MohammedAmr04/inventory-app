"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { useUnits } from "@/features/inventory/hooks/use-units";
import { UnitsTable } from "@/features/inventory/components/units-table";
import { UnitForm } from "@/features/inventory/components/unit-form";
import type { Unit, CreateUnitInput, UpdateUnitInput } from "@/features/inventory/types";

export default function UnitsPage() {
  const { units, loading, error, create, update, archive } = useUnits();
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = useCallback(
    async (data: CreateUnitInput | UpdateUnitInput) => {
      await create(data as CreateUnitInput);
      setShowForm(false);
    },
    [create],
  );

  const handleUpdate = useCallback(
    async (data: CreateUnitInput | UpdateUnitInput) => {
      if (!editingUnit) return;
      await update(editingUnit.id, data as UpdateUnitInput);
      setEditingUnit(null);
    },
    [editingUnit, update],
  );

  const handleArchive = useCallback(
    async (id: number) => {
      await archive(id);
    },
    [archive],
  );

  return (
    <div>
      <PageHeader
        title="Units"
        description="Manage measurement units"
        actions={
          !showForm && !editingUnit ? (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Add Unit
            </button>
          ) : null
        }
      />

      {showForm && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Create Unit</h2>
          <UnitForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editingUnit && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Edit Unit</h2>
          <UnitForm
            initialData={editingUnit}
            onSubmit={handleUpdate}
            onCancel={() => setEditingUnit(null)}
          />
        </div>
      )}

      <UnitsTable
        units={units}
        loading={loading}
        error={error}
        onEdit={(unit) => setEditingUnit(unit)}
        onArchive={handleArchive}
        onAdd={() => setShowForm(true)}
      />
    </div>
  );
}
