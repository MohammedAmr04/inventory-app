# /specs/002-inventory-module/architecture.md

# Inventory Architecture

## Feature Structure

```text
features/
  inventory/
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
Inventory Pages
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
/inventory
/inventory/products
/inventory/categories
/inventory/units
/inventory/stock-adjustments
/inventory/low-stock
```

---

# Components

```text
products-table
product-form
product-sheet
product-filters

categories-table
category-form
category-sheet

units-table
unit-form
unit-sheet

stock-adjustment-form
stock-adjustments-table

low-stock-card
barcode-input
```

---

# Stores

```text
inventory-store
barcode-store
stock-adjustment-store
```

---

# Hooks

```text
useProducts
useProduct
useCategories
useUnits
useLowStock
useStockAdjustments
```

---

# Services

```text
ProductService
CategoryService
UnitService
StockAdjustmentService
BarcodeService
LowStockService
ImportService
ExportService
```

---

# Repositories

```text
ProductRepository
CategoryRepository
UnitRepository
StockAdjustmentRepository
```

---

# Data Flow

```text
Page
 ↓
Hook
 ↓
Service
 ↓
Repository
 ↓
SQLite
```

---

# Shared Components

```text
DataTable
SearchInput
DeleteDialog
EmptyState
ErrorState
LoadingState
```

---

# Integrations

Barcode Scanner:

```text
BarcodeInput
      ↓
BarcodeService
      ↓
ScannerService
      ↓
Tauri
```
