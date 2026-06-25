# /specs/004-purchases-module/architecture.md

# Purchases Architecture

## Feature Structure

```text
features/
  purchases/
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
Purchase Pages
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
/purchases
/purchases/new
/purchases/[id]
/purchases/history
```

---

# Components

```text
purchase-invoices-table
purchase-form
purchase-sheet
purchase-items-table
purchase-summary-card
payment-summary-card
purchase-filters
purchase-details-card
```

---

# Stores

```text
purchases-store
purchase-cart-store
purchase-filters-store
```

---

# Hooks

```text
usePurchases
usePurchase
usePurchaseHistory
usePurchaseCalculations
```

---

# Services

```text
PurchaseInvoiceService
PurchaseCalculationService
PurchaseStockService
PurchasePrintService
```

---

# Repositories

```text
PurchaseInvoiceRepository
PurchaseItemRepository
```

---

# Integrations

Inventory Module
↓
Increase Product Stock

Suppliers Module
↓
Increase Supplier Balance
↓
Create Supplier Ledger Entry

Printing Module
↓
Print Purchase Invoice
