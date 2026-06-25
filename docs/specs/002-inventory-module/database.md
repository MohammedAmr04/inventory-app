# /specs/002-inventory-module/database.md

# Inventory Database Design

## Tables

```text
categories
units
products
stock_adjustments
```

---

# categories

```text
id
name
description
is_active
created_at
updated_at
```

---

# units

```text
id
name
symbol
is_active
created_at
updated_at
```

Examples:

* Piece
* Box
* KG
* Liter

---

# products

```text
id
name
barcode
type
category_id
unit_id
cost_price
sale_price
stock
low_stock_threshold
description
is_active
created_at
updated_at
```

---

# Product Type

```text
physical
service
```

---

# Relationships

```text
Category
    1
    ↓
Products
    N
```

```text
Unit
   1
   ↓
Products
   N
```

---

# stock_adjustments

```text
id
product_id
type
quantity
previous_stock
new_stock
reason
created_at
```

---

# Adjustment Type

```text
increase
decrease
set
```

---

# Relationships

```text
Product
    1
    ↓
StockAdjustments
    N
```

---

# Indexes

```text
products.name
products.barcode
products.category_id
products.type
stock_adjustments.product_id
stock_adjustments.created_at
```

---

# Transaction Rules

Stock Adjustment:

Create Adjustment
↓
Lock Product
↓
Update Product Stock
↓
Insert Adjustment Record
↓
Commit

Rollback on failure.
