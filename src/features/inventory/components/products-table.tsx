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
import type { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onEdit: (product: Product) => void;
  onArchive: (id: number) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
}

export function ProductsTable({
  products,
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
}: ProductsTableProps) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        action={<Button onClick={onAdd}>Add Product</Button>}
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-muted-foreground">{product.barcode ?? "—"}</TableCell>
              <TableCell className="capitalize">{product.type}</TableCell>
              <TableCell className="text-muted-foreground">{product.categoryName ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">{product.unitName ?? "—"}</TableCell>
              <TableCell className="text-right">{product.costPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.salePrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onArchive(product.id)}>
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
