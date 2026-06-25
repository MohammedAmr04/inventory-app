# /specs/005-pos-module/database.md

# POS Database Design

## Tables

```text
sales_invoices
invoice_items
held_invoices
held_invoice_items
```

---

# sales_invoices

```text
id
invoice_number
customer_name
subtotal
discount
tax
net_total
payment_method
cash_received
change_amount
created_at
updated_at
```

---

# invoice_items

```text
id
sales_invoice_id
product_id
quantity
sale_price
line_total
created_at
```

---

# held_invoices

```text
id
reference_number
subtotal
discount
tax
net_total
created_at
updated_at
```

---

# held_invoice_items

```text
id
held_invoice_id
product_id
quantity
sale_price
line_total
created_at
```

---

# Relationships

```text
SalesInvoice
      1
      ↓
InvoiceItems
      N
```

```text
HeldInvoice
      1
      ↓
HeldInvoiceItems
      N
```

---

# Indexes

```text
sales_invoices.invoice_number
sales_invoices.created_at
invoice_items.sales_invoice_id
invoice_items.product_id
held_invoices.created_at
held_invoice_items.held_invoice_id
```

---

# Transaction Rules

## Complete Sale

```text
Begin Transaction
        ↓
Insert Sales Invoice
        ↓
Insert Invoice Items
        ↓
Deduct Product Stock
        ↓
Commit
```

Rollback on failure.

---

# Business Rules

Physical Product:
stock -= quantity

Service:
stock unchanged

Prevent:
stock < 0
