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
import type { Category } from "../types";

interface CategoriesTableProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  onEdit: (category: Category) => void;
  onArchive: (id: number) => void;
  onAdd: () => void;
}

export function CategoriesTable({ categories, loading, error, onEdit, onArchive, onAdd }: CategoriesTableProps) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories found"
        action={<Button onClick={onAdd}>Add Category</Button>}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-muted-foreground">{category.description ?? "—"}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onArchive(category.id)}>
                Archive
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
