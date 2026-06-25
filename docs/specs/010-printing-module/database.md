# /specs/010-printing-module/database.md

# Printing Database Design

## Tables

```text
printer_profiles
print_jobs
```

---

# printer_profiles

```text
id
name
printer_name
type
paper_width
is_default
copies
created_at
updated_at
```

---

# Printer Types

```text
thermal
a4
pdf
```

---

# print_jobs

```text
id
profile_id
document_type
reference_id
status
copies
created_at
completed_at
```

---

# Document Types

```text
sales_receipt
purchase_invoice
dashboard_report
profit_loss_report
inventory_report
supplier_report
```

---

# Status

```text
pending
printing
completed
failed
cancelled
```

---

# Indexes

```text
printer_profiles.is_default
print_jobs.document_type
print_jobs.status
print_jobs.created_at
```

---

# Print Flow

```text
Generate Template
        ↓
Generate Preview
        ↓
Create Print Job
        ↓
Send To Printer
        ↓
Update Status
```

---

# Thermal Receipt Defaults

```text
paper_width = 80mm
copies = 1
auto_cut = true
```
