"use client";

import { useState } from "react";
import { CategoriesTable, CategoryForm } from "@/features/expenses/components";
import { Button } from "@/components/ui/button";
import type { ExpenseCategory } from "@/features/expenses/types";

export function CategoriesSection() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExpenseCategory | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          New Category
        </Button>
      </div>
      <CategoriesTable onEdit={(cat) => { setEditing(cat); setShowForm(true); }} />
      <CategoryForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        category={editing}
      />
    </div>
  );
}
