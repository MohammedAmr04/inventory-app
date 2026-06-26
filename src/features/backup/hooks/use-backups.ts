"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BackupInfo, BackupResult } from "../types";

export function useBackups() {
  const queryClient = useQueryClient();

  const query = useQuery<BackupInfo[]>({
    queryKey: ["backups"],
    queryFn: async () => {
      const res = await fetch("/api/backup");
      if (!res.ok) throw new Error("Failed to fetch backups");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (): Promise<BackupResult> => {
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (filename: string): Promise<BackupResult> => {
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", filename }),
      });
      return res.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["backups"] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (filename: string): Promise<BackupResult> => {
      const res = await fetch(`/api/backup?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
    },
  });

  return {
    backups: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createBackup: createMutation.mutateAsync,
    restoreBackup: restoreMutation.mutateAsync,
    deleteBackup: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isRestoring: restoreMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
