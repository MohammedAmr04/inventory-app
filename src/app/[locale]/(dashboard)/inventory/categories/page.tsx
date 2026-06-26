"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { useCategories } from "@/features/inventory/hooks/use-categories";
import { CategoriesTable } from "@/features/inventory/components/categories-table";
import { CategoryForm } from "@/features/inventory/components/category-form";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "@/features/inventory/types";

export default function CategoriesPage() {
  const { categories, loading, error, create, update, archive } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = useCallback(
    async (data: CreateCategoryInput | UpdateCategoryInput) => {
      await create(data as CreateCategoryInput);
      setShowForm(false);
    },
    [create],
  );

  const handleUpdate = useCallback(
    async (data: CreateCategoryInput | UpdateCategoryInput) => {
      if (!editingCategory) return;
      await update(editingCategory.id, data as UpdateCategoryInput);
      setEditingCategory(null);
    },
    [editingCategory, update],
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
        title="Categories"
        description="Manage product categories"
        actions={
          !showForm && !editingCategory ? (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Add Category
            </button>
          ) : null
        }
      />

      {showForm && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Create Category</h2>
          <CategoryForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editingCategory && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Edit Category</h2>
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleUpdate}
            onCancel={() => setEditingCategory(null)}
          />
        </div>
      )}

      <CategoriesTable
        categories={categories}
        loading={loading}
        error={error}
        onEdit={(category) => setEditingCategory(category)}
        onArchive={handleArchive}
        onAdd={() => setShowForm(true)}
      />
    </div>
  );
}
