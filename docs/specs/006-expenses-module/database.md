# /specs/006-expenses-module/database.md

# Expenses Database Design

## Tables

```text
expense_categories
expenses
```

---

# expense_categories

```text
id
name
description
is_active
created_at
updated_at
```

---

# Seed Categories

```text
Rent
Utilities
Salaries
Transportation
Internet
Maintenance
Miscellaneous
```

---

# expenses

```text
id
category_id
amount
description
notes
expense_date
created_at
updated_at
```

---

# Relationships

```text
ExpenseCategory
      1
      ↓
Expenses
      N
```

---

# Indexes

```text
expense_categories.name

expenses.category_id
expenses.expense_date
expenses.amount
expenses.created_at
```

---

# Transaction Rules

## Create Expense

```text
Begin Transaction
        ↓
Validate Category
        ↓
Insert Expense
        ↓
Commit
```

Rollback on failure.

---

# Statistics Queries

```text
Total Expenses

Expenses By Category

Monthly Expenses

Average Monthly Expenses
```

---

# Reports Integration

```text
Net Profit

=
Sales Revenue
-
Cost Of Goods Sold
-
Operational Expenses
```

Expenses Module becomes one of the core data sources for P&L calculations.
