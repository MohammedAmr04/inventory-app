"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/features/inventory/types";

async function searchByBarcode(barcode: string): Promise<Product | null> {
  const res = await fetch(`/api/inventory/products?barcode=${encodeURIComponent(barcode)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data?.items?.[0] ?? data?.[0] ?? null;
}

async function searchByName(query: string): Promise<Product[]> {
  const res = await fetch(`/api/inventory/products?search=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data?.items ?? data ?? [];
}

export function useBarcodeSearch(barcode: string | null) {
  return useQuery({
    queryKey: ["product-barcode", barcode],
    queryFn: () => searchByBarcode(barcode!),
    enabled: barcode !== null && barcode.length > 0,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ["product-search", query],
    queryFn: () => searchByName(query),
    enabled: query.length > 0,
  });
}
