"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInventoryStore } from "../stores/inventory-store";
import type { CreateProductInput, UpdateProductInput, ProductFilters } from "../types";

const PRODUCTS_KEY = ["products"] as const;

function buildUrl(filters: ProductFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId != null) params.set("categoryId", String(filters.categoryId));
  if (filters.type) params.set("type", filters.type);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  const qs = params.toString();
  return `/api/inventory/products${qs ? `?${qs}` : ""}`;
}

async function fetchAll(filters: ProductFilters) {
  const res = await fetch(buildUrl(filters));
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchById(id: number) {
  const res = await fetch(`/api/inventory/products?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

async function createProduct(input: CreateProductInput) {
  const res = await fetch("/api/inventory/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

async function updateProduct(id: number, input: UpdateProductInput) {
  const res = await fetch(`/api/inventory/products?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

async function archiveProduct(id: number) {
  const res = await fetch(`/api/inventory/products?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to archive product");
}

export function useProducts() {
  const queryClient = useQueryClient();
  const filters = useInventoryStore((state) => state.productFilters);

  const { data, isLoading, error } = useQuery({
    queryKey: [...PRODUCTS_KEY, filters],
    queryFn: () => fetchAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateProductInput }) => updateProduct(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
    update: async (id: number, input: UpdateProductInput) => updateMutation.mutateAsync({ id, input }),
    archive: archiveMutation.mutateAsync,
  };
}

export function useProduct(id: number | null) {
  const { data: product, isLoading, error } = useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: () => fetchById(id!),
    enabled: id !== null,
  });

  return {
    product: product ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
