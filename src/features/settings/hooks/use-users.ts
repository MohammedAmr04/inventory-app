"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, UserFormData } from "../types";

export function useUsers() {
  const queryClient = useQueryClient();

  const query = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/settings/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const res = await fetch("/api/settings/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UserFormData> }) => {
      const res = await fetch("/api/settings/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/settings/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, toggleActive: true }),
      });
      if (!res.ok) throw new Error("Failed to toggle user status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/settings/users?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    toggleActive: toggleActiveMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
