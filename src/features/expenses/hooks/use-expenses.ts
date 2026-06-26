"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useExpensesStore } from "../stores";
import type { CreateExpenseInput, UpdateExpenseInput } from "../types";

const EXPENSES_KEY = ["expenses"] as const;

function buildUrl(filters: ReturnType<typeof useExpensesStore.getState>["filters"]) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", String(filters.categoryId));
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  return `/api/expenses?${params.toString()}`;
}

async function fetchAll(filters: ReturnType<typeof useExpensesStore.getState>["filters"]) {
  const res = await fetch(buildUrl(filters));
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

async function fetchById(id: number) {
  const res = await fetch(`/api/expenses?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch expense");
  return res.json();
}

async function createExpense(input: CreateExpenseInput) {
  const res = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create expense");
  }
  return res.json();
}

async function updateExpense(input: UpdateExpenseInput & { id: number }) {
  const { id, ...data } = input;
  const res = await fetch("/api/expenses", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
}

async function deleteExpense(id: number) {
  const res = await fetch("/api/expenses", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}

export function useExpenses() {
  const queryClient = useQueryClient();
  const filters = useExpensesStore((s) => s.filters);

  const { data, isLoading, error } = useQuery({
    queryKey: [...EXPENSES_KEY, filters],
    queryFn: () => fetchAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    remove: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useExpense(id: number | null) {
  return useQuery({
    queryKey: [...EXPENSES_KEY, id],
    queryFn: () => fetchById(id!),
    enabled: id !== null,
  });
}
