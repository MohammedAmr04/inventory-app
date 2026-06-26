"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateHeldInvoiceInput } from "../types";

const HELD_KEY = ["held-invoices"] as const;

async function fetchHeld() {
  const res = await fetch("/api/pos/hold");
  if (!res.ok) throw new Error("Failed to fetch held invoices");
  return res.json();
}

async function holdInvoice(input: CreateHeldInvoiceInput) {
  const res = await fetch("/api/pos/hold", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to hold invoice");
  }
  return res.json();
}

async function resumeInvoice(id: number) {
  const res = await fetch("/api/pos/hold", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to resume invoice");
  }
  return res.json();
}

export function useHeldInvoices() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: HELD_KEY,
    queryFn: fetchHeld,
  });

  const holdMutation = useMutation({
    mutationFn: holdInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HELD_KEY });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: resumeInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HELD_KEY });
    },
  });

  return {
    data: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
    hold: holdMutation.mutateAsync,
    isHolding: holdMutation.isPending,
    resume: resumeMutation.mutateAsync,
    isResuming: resumeMutation.isPending,
  };
}
