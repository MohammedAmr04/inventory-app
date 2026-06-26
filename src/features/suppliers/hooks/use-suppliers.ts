"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSuppliersStore } from "../stores/suppliers-store";
import type { CreateSupplierInput, UpdateSupplierInput } from "../types";

const SUPPLIERS_KEY = ["suppliers"] as const;

function buildUrl(filters: ReturnType<typeof useSuppliersStore.getState>["filters"]) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  return `/api/suppliers?${params.toString()}`;
}

async function fetchAll(filters: ReturnType<typeof useSuppliersStore.getState>["filters"]) {
  const res = await fetch(buildUrl(filters));
  if (!res.ok) throw new Error("Failed to fetch suppliers");
  return res.json();
}

async function createSupplier(input: CreateSupplierInput) {
  const res = await fetch("/api/suppliers", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create supplier");
  return res.json();
}

async function updateSupplier(id: number, input: UpdateSupplierInput) {
  const res = await fetch(`/api/suppliers?id=${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update supplier");
  return res.json();
}

async function archiveSupplier(id: number) {
  const res = await fetch(`/api/suppliers?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to archive supplier");
}

export function useSuppliers() {
  const queryClient = useQueryClient();
  const filters = useSuppliersStore((s) => s.filters);

  const { data, isLoading, error } = useQuery({
    queryKey: [...SUPPLIERS_KEY, filters],
    queryFn: () => fetchAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateSupplierInput }) => updateSupplier(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY }),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY }),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
    update: async (id: number, input: UpdateSupplierInput) => updateMutation.mutateAsync({ id, input }),
    archive: archiveMutation.mutateAsync,
  };
}
