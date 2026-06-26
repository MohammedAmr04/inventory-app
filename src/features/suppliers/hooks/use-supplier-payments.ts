"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSupplierPaymentInput } from "../types";

function buildUrl(supplierId: number, page: number, pageSize: number) {
  const params = new URLSearchParams();
  params.set("supplierId", String(supplierId));
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  return `/api/suppliers/payments?${params.toString()}`;
}

async function fetchPayments(supplierId: number, page: number, pageSize: number) {
  const res = await fetch(buildUrl(supplierId, page, pageSize));
  if (!res.ok) throw new Error("Failed to fetch supplier payments");
  return res.json();
}

async function createPayment(input: CreateSupplierPaymentInput) {
  const res = await fetch("/api/suppliers/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create payment");
  return res.json();
}

export function useSupplierPayments(supplierId?: number, page = 1, pageSize = 20) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["supplier-payments", supplierId, page, pageSize],
    queryFn: () => fetchPayments(supplierId!, page, pageSize),
    enabled: supplierId !== undefined,
  });

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-payments", supplierId] });
    },
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    create: createMutation.mutateAsync,
  };
}
