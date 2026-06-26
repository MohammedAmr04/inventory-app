"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { StoreSettings } from "../types";

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<StoreSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<StoreSettings>) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
