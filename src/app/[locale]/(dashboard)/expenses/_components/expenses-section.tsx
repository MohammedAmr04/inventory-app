"use client";

import { useState } from "react";
import { ExpensesTable, ExpenseFilters, ExpenseForm } from "@/features/expenses/components";
import { Button } from "@/components/ui/button";
import type { Expense } from "@/features/expenses/types";

export function ExpensesSection() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  function handleEdit(expense: Expense) {
    setEditing(expense);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    // handled by hook
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ExpenseFilters />
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          New Expense
        </Button>
      </div>
      <ExpensesTable onEdit={handleEdit} onDelete={handleDelete} />
      <ExpenseForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        expense={editing}
      />
    </div>
  );
}
