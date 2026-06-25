# /specs/003-suppliers-module/database.md

# Suppliers Database Design

## Tables

```text
suppliers
supplier_payments
supplier_ledger
```

---

# suppliers

```text
id
name
phone
email
address
notes
current_balance
is_active
created_at
updated_at
```

---

# supplier_payments

```text
id
supplier_id
amount
payment_date
notes
created_at
```

---

# Relationships

```text
Supplier
    1
    ↓
SupplierPayments
    N
```

---

# supplier_ledger

```text
id
supplier_id
reference_type
reference_id
amount
balance_after
description
created_at
```

---

# Reference Types

```text
purchase_invoice
payment
manual_adjustment
```

---

# Relationships

```text
Supplier
    1
    ↓
SupplierLedger
    N
```

---

# Indexes

```text
suppliers.name
suppliers.phone
suppliers.current_balance

supplier_payments.supplier_id
supplier_payments.payment_date

supplier_ledger.supplier_id
supplier_ledger.reference_type
supplier_ledger.created_at
```

---

# Transaction Rules

## Record Supplier Payment

```text
Begin Transaction
        ↓
Insert Payment
        ↓
Decrease Supplier Balance
        ↓
Insert Ledger Entry
        ↓
Commit
```

Rollback on failure.

---

## Credit Purchase Integration

```text
Purchase Invoice Saved
        ↓
Due Amount > 0
        ↓
Increase Supplier Balance
        ↓
Insert Ledger Entry
        ↓
Commit
```
