"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateExpenseCategoryInput, UpdateExpenseCategoryInput } from "../types";

const CATEGORIES_KEY = ["expense-categories"] as const;

async function fetchCategories() {
  const res = await fetch("/api/expenses/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function createCategory(input: CreateExpenseCategoryInput) {
  const res = await fetch("/api/expenses/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create category");
  }
  return res.json();
}

async function updateCategory(input: UpdateExpenseCategoryInput & { id: number }) {
  const { id, ...data } = input;
  const res = await fetch("/api/expenses/categories", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

export function useExpenseCategories() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });

  return {
    data: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
