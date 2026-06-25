# /specs/003-suppliers-module/architecture.md

# Suppliers Architecture

## Feature Structure

```text
features/
  suppliers/
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
Supplier Pages
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
/suppliers
/suppliers/[id]
/suppliers/payments
/suppliers/top-debts
```

---

# Components

```text
suppliers-table
supplier-form
supplier-sheet
supplier-filters

supplier-details-card
supplier-balance-card
supplier-statistics-card

supplier-ledger-table

payment-form
payment-sheet

top-debt-card
```

---

# Stores

```text
suppliers-store
payments-store
ledger-store
```

---

# Hooks

```text
useSuppliers
useSupplier
useSupplierPayments
useSupplierLedger
useTopDebts
```

---

# Services

```text
SupplierService
SupplierPaymentService
SupplierLedgerService
SupplierAnalyticsService
```

---

# Repositories

```text
SupplierRepository
SupplierPaymentRepository
SupplierLedgerRepository
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

# Integration Points

Future integrations:

Purchases Module
↓
Increase Supplier Balance

Payments Module
↓
Decrease Supplier Balance

Reports Module
↓
Read Supplier Analytics
