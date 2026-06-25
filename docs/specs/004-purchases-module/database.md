# /specs/004-purchases-module/database.md

# Purchases Database Design

## Tables

```text
purchase_invoices
purchase_items
```

---

# purchase_invoices

```text
id
supplier_id
invoice_number
subtotal
discount
total_amount
paid_amount
due_amount
notes
purchase_date
created_at
updated_at
```

---

# Relationships

```text
Supplier
    1
    ↓
PurchaseInvoices
    N
```

---

# purchase_items

```text
id
purchase_invoice_id
product_id
quantity
purchase_price
line_total
created_at
```

---

# Relationships

```text
PurchaseInvoice
      1
      ↓
PurchaseItems
      N
```

```text
Product
    1
    ↓
PurchaseItems
    N
```

---

# Indexes

```text
purchase_invoices.invoice_number
purchase_invoices.supplier_id
purchase_invoices.purchase_date
purchase_items.purchase_invoice_id
purchase_items.product_id
```

---

# Transaction Rules

## Save Purchase Invoice

```text
Begin Transaction
        ↓
Insert Purchase Invoice
        ↓
Insert Purchase Items
        ↓
Increment Product Stock
        ↓
If Due Amount > 0
        ↓
Increase Supplier Balance
        ↓
Create Supplier Ledger Entry
        ↓
Commit
```

Rollback on failure.

---

# Business Rules

## Full Payment

```text
paid_amount = total_amount
due_amount = 0
supplier balance unchanged
```

## Partial Payment

```text
paid_amount < total_amount
due_amount = total_amount - paid_amount
supplier balance += due_amount
```
