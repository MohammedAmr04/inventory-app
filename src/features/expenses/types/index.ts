export interface ExpenseCategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateExpenseCategoryInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface Expense {
  id: number;
  categoryId: number;
  amount: number;
  description: string;
  notes: string | null;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
  categoryName?: string | null;
}

export interface CreateExpenseInput {
  categoryId: number;
  amount: number;
  description: string;
  notes?: string;
  expenseDate?: string;
}

export interface UpdateExpenseInput {
  categoryId?: number;
  amount?: number;
  description?: string;
  notes?: string;
  expenseDate?: string;
}

export interface ExpenseFilters {
  search?: string;
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ExpenseStats {
  totalExpenses: number;
  categoryBreakdown: { categoryName: string | null; total: number; count: number }[];
  monthlyExpenses: { month: string; total: number }[];
  averageMonthly: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
