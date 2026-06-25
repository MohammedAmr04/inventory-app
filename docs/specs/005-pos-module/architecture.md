# /specs/005-pos-module/architecture.md

# POS Architecture

## Feature Structure

```text
features/
  pos/
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
POS Screen
      ↓
Feature Hooks
      ↓
Services
      ↓
Repositories
      ↓
SQLite Database
      ↓
Tauri Native APIs
```

---

# Pages

```text
/pos
/pos/history
/pos/invoices/[id]
```

---

# Components

```text
pos-layout
search-barcode-input
products-search-sheet
cart-table
cart-summary-card
discount-input
payment-dialog
change-card
held-invoices-sheet
invoice-history-table
receipt-preview
shortcut-bar
```

---

# Stores

```text
pos-store
cart-store
payment-store
held-invoices-store
receipt-store
```

---

# Hooks

```text
usePos
useCart
useBarcode
usePayment
useHeldInvoices
useInvoiceHistory
useKeyboardShortcuts
```

---

# Services

```text
PosService
CartService
BarcodeService
PaymentService
InvoiceService
HeldInvoiceService
ReceiptService
PrinterService
KeyboardShortcutService
```

---

# Repositories

```text
SalesInvoiceRepository
InvoiceItemRepository
HeldInvoiceRepository
```

---

# Integrations

Inventory Module
↓
Deduct Product Stock

Printing Module
↓
Print Receipt

Reports Module
↓
Generate Sales Analytics

Scanner Service
↓
Barcode Scanning
