# /specs/010-printing-module/architecture.md

# Printing Architecture

## Feature Structure

```text
features/
  printing/
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
Application Modules
        ↓
Print Services
        ↓
Template Engine
        ↓
Printer Service
        ↓
Tauri Native Commands
        ↓
Windows Print APIs
```

---

# Pages

```text
/settings/printers
/settings/printers/test
```

---

# Components

```text
printers-table
printer-profile-form
printer-selector

receipt-preview
purchase-preview
report-preview

print-dialog
test-print-dialog
printer-status-card
```

---

# Stores

```text
printing-store
printer-store
print-jobs-store
preview-store
```

---

# Hooks

```text
usePrinters
useReceiptPrinting
usePurchasePrinting
useReportPrinting
usePrintPreview
```

---

# Services

```text
PrinterService
ReceiptPrintService
PurchasePrintService
ReportPrintService
PrintPreviewService
PrintQueueService
TemplateService
```

---

# Integrations

POS Module
↓
Sales Receipt Printing

Purchases Module
↓
Purchase Invoice Printing

Reports Module
↓
Reports Printing

Settings Module
↓
Printer Configuration
