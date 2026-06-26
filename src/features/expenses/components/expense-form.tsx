"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useExpenses, useExpenseCategories } from "../hooks";
import type { Expense } from "../types";

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export function ExpenseForm({ open, onClose, expense }: ExpenseFormProps) {
  const { data: categories } = useExpenseCategories();
  const { create, isCreating, update, isUpdating } = useExpenses();

  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? 0);
  const [amount, setAmount] = useState(expense?.amount ?? 0);
  const [description, setDescription] = useState(expense?.description ?? "");
  const [notes, setNotes] = useState(expense?.notes ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (expense) {
        await update({ id: expense.id, categoryId, amount, description, notes: notes || undefined });
      } else {
        await create({ categoryId, amount, description, notes: notes || undefined });
      }
      onClose();
    } catch {
      // handled by hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "New Expense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value={0} disabled>Select category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : expense ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
