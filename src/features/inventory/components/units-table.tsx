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
import type { Unit } from "../types";

interface UnitsTableProps {
  units: Unit[];
  loading: boolean;
  error: string | null;
  onEdit: (unit: Unit) => void;
  onArchive: (id: number) => void;
  onAdd: () => void;
}

export function UnitsTable({ units, loading, error, onEdit, onArchive, onAdd }: UnitsTableProps) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (units.length === 0) {
    return (
      <EmptyState
        title="No units found"
        action={<Button onClick={onAdd}>Add Unit</Button>}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.name}</TableCell>
            <TableCell>{unit.symbol}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onEdit(unit)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onArchive(unit.id)}>
                Archive
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
