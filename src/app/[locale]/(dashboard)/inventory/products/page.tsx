"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { useProducts } from "@/features/inventory/hooks/use-products";
import { useCategories } from "@/features/inventory/hooks/use-categories";
import { useUnits } from "@/features/inventory/hooks/use-units";
import { ProductsTable } from "@/features/inventory/components/products-table";
import { ProductForm } from "@/features/inventory/components/product-form";
import { useInventoryStore } from "@/features/inventory/stores/inventory-store";
import type { Product, CreateProductInput, UpdateProductInput } from "@/features/inventory/types";
import { BarcodeInput } from "@/features/inventory/components/barcode-input";

async function searchByBarcode(barcode: string) {
  const res = await fetch(`/api/inventory/products?barcode=${encodeURIComponent(barcode)}`);
  if (!res.ok) return null;
  return res.json();
}

export default function ProductsPage() {
  const { data, loading, error, create, update, archive } = useProducts();
  const { categories } = useCategories();
  const { units } = useUnits();
  const { productFilters, setProductFilters } = useInventoryStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [barcodeProduct, setBarcodeProduct] = useState<Product | null>(null);

  const handleCreate = useCallback(
    async (input: CreateProductInput | UpdateProductInput) => {
      await create(input as CreateProductInput);
      setShowForm(false);
    },
    [create],
  );

  const handleUpdate = useCallback(
    async (input: CreateProductInput | UpdateProductInput) => {
      if (!editingProduct) return;
      await update(editingProduct.id, input as UpdateProductInput);
      setEditingProduct(null);
    },
    [editingProduct, update],
  );

  const handleArchive = useCallback(
    async (id: number) => {
      await archive(id);
    },
    [archive],
  );

  const handleBarcodeSearch = useCallback(async (barcode: string) => {
    const product = await searchByBarcode(barcode);
    setBarcodeProduct(product ?? null);
    if (product) {
      setProductFilters({ search: barcode });
    }
  }, [setProductFilters]);

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your products and services"
        actions={
          !showForm && !editingProduct ? (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Add Product
            </button>
          ) : null
        }
      />

      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <BarcodeInput onBarcodeScanned={handleBarcodeSearch} />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={productFilters.search ?? ""}
          onChange={(e) => setProductFilters({ search: e.target.value, page: 1 })}
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
        />
      </div>

      {barcodeProduct && (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-sm">
            Found: <strong>{barcodeProduct.name}</strong> (Stock: {barcodeProduct.stock})
          </p>
        </div>
      )}

      {showForm && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Create Product</h2>
          <ProductForm
            categories={categories}
            units={units}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingProduct && (
        <div className="mb-6 rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Edit Product</h2>
          <ProductForm
            initialData={editingProduct}
            categories={categories}
            units={units}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      <ProductsTable
        products={data?.items ?? []}
        loading={loading}
        error={error}
        total={data?.total ?? 0}
        page={data?.page ?? 1}
        pageSize={data?.pageSize ?? 20}
        totalPages={data?.totalPages ?? 0}
        onEdit={(product) => setEditingProduct(product)}
        onArchive={handleArchive}
        onPageChange={(page) => setProductFilters({ page })}
        onAdd={() => setShowForm(true)}
      />
    </div>
  );
}
