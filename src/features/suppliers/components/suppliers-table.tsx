"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingState, ErrorState } from "@/components/feedback";
import type { Supplier } from "../types";

interface SuppliersTableProps {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onEdit: (supplier: Supplier) => void;
  onArchive: (id: number) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
}

export function SuppliersTable({
  suppliers,
  loading,
  error,
  total,
  page,
  pageSize,
  totalPages,
  onEdit,
  onArchive,
  onPageChange,
  onAdd,
}: SuppliersTableProps) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (suppliers.length === 0) {
    return (
      <EmptyState
        title="No suppliers found"
        action={<Button onClick={onAdd}>Add Supplier</Button>}
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell className="text-muted-foreground">{supplier.phone ?? "—"}</TableCell>
              <TableCell className="text-right">{supplier.currentBalance.toFixed(2)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(supplier.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onEdit(supplier)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onArchive(supplier.id)}>
                  Archive
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
