# /specs/006-expenses-module/architecture.md

# Expenses Architecture

## Feature Structure

```text
features/
  expenses/
    components/
    hooks/
    services/
    repositories/
    schemas/
    stores/
    types/
    constants/
    utils/
```

---

# Layers

```text
Expenses Pages
      ↓
Feature Hooks
      ↓
Services
      ↓
Repositories
      ↓
SQLite Database
```

---

# Pages

```text
/expenses
/expenses/categories
/expenses/monthly
/expenses/statistics
```

---

# Components

```text
expenses-table
expense-form
expense-sheet
expense-details-sheet
expense-filters

categories-table
category-form
category-sheet

expense-summary-card
monthly-expenses-chart
statistics-card
export-dialog
```

---

# Stores

```text
expenses-store
expense-filters-store
expense-statistics-store
```

---

# Hooks

```text
useExpenses
useExpense
useExpenseCategories
useExpenseStatistics
useMonthlyExpenses
```

---

# Services

```text
ExpenseService
ExpenseCategoryService
ExpenseStatisticsService
ExpenseExportService
```

---

# Repositories

```text
ExpenseRepository
ExpenseCategoryRepository
```

---

# Integrations

Reports Module
↓
Profit & Loss

Dashboard Module
↓
Expense Statistics

Export Module
↓
CSV / Excel Export
