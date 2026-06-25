# /specs/007-reports-module/architecture.md

# Reports Architecture

## Feature Structure

```text
features/
  reports/
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
Reports Pages
      ↓
Feature Hooks
      ↓
Report Services
      ↓
Analytics Queries
      ↓
SQLite Database
```

---

# Pages

```text
/reports
/reports/sales
/reports/products
/reports/suppliers
/reports/expenses
/reports/profit-loss
```

---

# Components

```text
dashboard-summary-cards
sales-chart
payment-method-chart

top-selling-table
most-profitable-table
dead-stock-table
low-stock-table

supplier-debts-table
expenses-chart

profit-loss-card
profit-loss-table

report-filters
date-range-picker
export-dialog
```

---

# Stores

```text
reports-store
report-filters-store
dashboard-store
```

---

# Hooks

```text
useDashboard
useSalesReports
useProductReports
useSupplierReports
useExpenseReports
useProfitLoss
```

---

# Services

```text
DashboardService
SalesReportService
ProductReportService
SupplierReportService
ExpenseReportService
ProfitLossService
ExportReportService
```

---

# Repositories

Reports are read-only.

```text
InventoryRepository
PurchaseRepository
SalesRepository
SupplierRepository
ExpenseRepository
```

---

# Data Sources

```text
Inventory
      +
Suppliers
      +
Purchases
      +
POS
      +
Expenses
      ↓
Reports
```

Reports never modify data.
They only aggregate and analyze existing data.
