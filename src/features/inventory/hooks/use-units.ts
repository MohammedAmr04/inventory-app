"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUnitInput, UpdateUnitInput } from "../types";

const UNITS_KEY = ["units"] as const;

async function fetchAll() {
  const res = await fetch("/api/inventory/units");
  if (!res.ok) throw new Error("Failed to fetch units");
  return res.json();
}

async function createUnit(input: CreateUnitInput) {
  const res = await fetch("/api/inventory/units", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create unit");
  return res.json();
}

async function updateUnit(id: number, input: UpdateUnitInput) {
  const res = await fetch(`/api/inventory/units?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update unit");
  return res.json();
}

async function archiveUnit(id: number) {
  const res = await fetch(`/api/inventory/units?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to archive unit");
}

export function useUnits() {
  const queryClient = useQueryClient();

  const { data: units = [], isLoading, error } = useQuery({
    queryKey: UNITS_KEY,
    queryFn: fetchAll,
  });

  const createMutation = useMutation({
    mutationFn: createUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNITS_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateUnitInput }) => updateUnit(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNITS_KEY }),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNITS_KEY }),
  });

  return {
    units,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
    update: async (id: number, input: UpdateUnitInput) => updateMutation.mutateAsync({ id, input }),
    archive: archiveMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
