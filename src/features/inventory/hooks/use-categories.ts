"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCategoryInput, UpdateCategoryInput } from "../types";

const CATEGORIES_KEY = ["categories"] as const;

async function fetchAll() {
  const res = await fetch("/api/inventory/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function createCategory(input: CreateCategoryInput) {
  const res = await fetch("/api/inventory/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

async function updateCategory(id: number, input: UpdateCategoryInput) {
  const res = await fetch(`/api/inventory/categories?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

async function archiveCategory(id: number) {
  const res = await fetch(`/api/inventory/categories?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to archive category");
}

export function useCategories() {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: fetchAll,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCategoryInput }) => updateCategory(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });

  return {
    categories,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
    update: async (id: number, input: UpdateCategoryInput) => updateMutation.mutateAsync({ id, input }),
    archive: archiveMutation.mutateAsync,
  };
}
