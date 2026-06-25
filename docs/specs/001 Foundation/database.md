# Foundation Database Architecture

## RetailX Desktop ERP System

### Database Engine

* SQLite
* Offline First
* Single Database File
* Automatic Migrations
* Automatic Seed System
* Transaction Support

Database location:

```text
app_data/
  retailx.db
```

---

# Architecture

```text
Feature Service
        ↓
Repository
        ↓
Drizzle ORM
        ↓
SQLite Database
```

Rules:

* Services never access database directly.
* Database access must go through repositories.
* All write operations must be transactional.
* Repositories are backend-only.

---

# Folder Structure

```text
src/

backend/
  db/
    index.ts
    schema/
    migrations/
    seeds/
```

---

# Database Bootstrap Flow

```text
Application Startup
        ↓
Open SQLite Connection
        ↓
Run Migrations
        ↓
Seed System Data
        ↓
Initialize Repositories
        ↓
Application Ready
```

---

# Common Columns

Every business table should contain:

```text
id
createdAt
updatedAt
```

Optional:

```text
deletedAt
isActive
```

---

# Naming Convention

Tables:

```text
products
categories
suppliers
sales_invoices
purchase_invoices
expenses
```

Columns:

```text
created_at
updated_at
deleted_at
sale_price
cost_price
```

Foreign Keys:

```text
supplier_id
product_id
category_id
invoice_id
```

---

# Transaction Rules

Must use transactions for:

* Sales invoices
* Purchase invoices
* Stock adjustments
* Supplier payments
* Restore operations
* Database imports

Example:

```text
Create Invoice
      ↓
Insert Invoice
      ↓
Insert Invoice Items
      ↓
Update Product Stock
      ↓
Commit Transaction
```

Rollback on failure.

---

# Index Strategy

Create indexes for:

```text
barcode
name
supplier_id
product_id
created_at
```

Reports may add additional indexes when required.

---

# Seed Data

Foundation seeds:



Settings:

* Currency
* Tax Rate
* Theme
* Language

Expense Categories:

* Rent
* Utilities
* Salaries
* Miscellaneous

---

# Backup Strategy

Database file:

```text
app_data/
  retailx.db
```

Backups:

```text
app_data/
  backups/
```

Rules:

* Manual backup
* Restore support
* Database export
* Database import

---

# Performance Requirements

Application Startup:
< 2 seconds

Product Search:
< 100 milliseconds

POS Barcode Scan:
instant response

Target Dataset:

* 50,000+ products
* 500,000+ invoices
* Multi-year transaction history

```
```
