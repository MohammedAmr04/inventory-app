# /specs/007-reports-module/database.md

# Reports Database Design

Reports module does not own tables.

Reports consume existing tables:

```text
products
suppliers
purchase_invoices
purchase_items
sales_invoices
invoice_items
expenses
expense_categories
supplier_ledger
```

---

# Dashboard Queries

## Today's Sales

```text
SUM(sales_invoices.net_total)
WHERE created_at = today
```

---

## Today's Expenses

```text
SUM(expenses.amount)
WHERE expense_date = today
```

---

## Today's Profit

```text
today_sales
-
today_cogs
-
today_expenses
```

---

# Top Selling Products

```text
SUM(invoice_items.quantity)
GROUP BY product_id
ORDER BY quantity DESC
```

---

# Most Profitable Products

```text
(
invoice_items.sale_price
-
products.cost_price
)
*
invoice_items.quantity
```

---

# Dead Stock

Products with:

```text
last_sale_date > configurable_period
```

Default:

90 days

---

# Low Stock

Products where:

```text
stock
<=
low_stock_threshold
```

---

# Supplier Debts

```text
SUM(suppliers.current_balance)
```

---

# Profit & Loss Formula

```text
Net Profit

=
Sales Revenue
-
Cost Of Goods Sold
-
Operational Expenses
```

---

# Required Indexes

```text
sales_invoices.created_at
invoice_items.product_id
products.stock
expenses.expense_date
suppliers.current_balance
supplier_ledger.created_at
```
