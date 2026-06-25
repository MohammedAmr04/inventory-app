"# inventory-app" 
# RetailX
### Smart Inventory, POS & Mini-ERP Desktop System

RetailX is an offline-first Desktop Application built for supermarkets, retail stores, and small businesses to manage inventory, sales, suppliers, expenses, and business analytics from a single application.

The system is designed for speed, reliability, and zero cloud dependency.

---

# Vision

Build a modern desktop ERP that:

- Works completely offline
- Requires no hosting costs
- Provides fast checkout experiences
- Supports native desktop integrations
- Is easy to deploy and maintain
- Scales from small stores to multi-branch businesses

---

# Core Principles

### Offline First
The application must function without internet connectivity.

### Desktop Native
Desktop capabilities should be implemented using Tauri native APIs whenever possible.

### Performance First
The application should remain responsive even with large datasets.

### Modular Architecture
Business modules must remain isolated and independently maintainable.

### Type Safety
All layers should be strongly typed using TypeScript.

### Specification Driven Development
Implementation must follow the specifications inside `/specs`.

---

# Technology Stack

## Frontend

- Next.js 15 (App Router)
- TypeScript
- React 19
- Tailwind CSS
- Ionic React
- shadcn/ui
- next-intl
- Zustand
- React Hook Form
- Zod

## Desktop

- Tauri v2
- Rust Commands

## Database

- SQLite
- Drizzle ORM

## Development

- ESLint
- Prettier
- Husky
- lint-staged

---

# Project Structure

```text
src/

├── app/
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   ├── feedback/
│   └── layouts/
│
├── features/
│
├── hooks/
│
├── lib/
│   ├── db/
│   ├── logger/
│   ├── printer/
│   ├── scanner/
│   ├── filesystem/
│   ├── backup/
│   └── i18n/
│
├── stores/
├── types/
├── constants/
├── common/
├── messages/
└── specs/

src-tauri/
├── src/
├── capabilities/
├── icons/
└── bundles/
```

---

# Architecture

All business flows must follow:

```text
Page
↓
Hook
↓
Store
↓
Service
↓
Repository
↓
SQLite Database
```

Never bypass layers.

---

# Feature Architecture

Every module should follow:

```text
features/
  module-name/
    components/
    hooks/
    services/
    repositories/
    schemas/
    stores/
    types/
    constants/
    utils/
    index.ts
```

---

# Shared Components

Reusable components:

```text
components/
  ui/
  forms/
  tables/
  feedback/
  layouts/
```

Feature-specific components:

```text
features/<feature>/components/
```

---

# State Management

Global state:

```text
stores/
```

Feature state:

```text
features/<feature>/stores/
```

UI state and database state must remain separated.

---

# Localization

Supported languages:

- English
- Arabic

Translations:

```text
messages/
├── en.json
└── ar.json
```

Rules:

- No hardcoded strings
- All UI text must use next-intl
- RTL support is required

---

# Validation

Forms use:

- React Hook Form
- Zod

Every form must have:

- schema
- default values
- typed form values
- validation messages

---

# Database

Engine:

SQLite

ORM:

Drizzle ORM

Database location:

```text
RetailX/
└── retailx.db
```

Database access is allowed only inside repositories.

---

# Native Integrations

Desktop integrations are implemented through Tauri:

- Thermal Printers
- Barcode Scanners
- Filesystem
- Dialog APIs
- Window APIs
- Backup System

Architecture:

```text
UI
↓
Hook
↓
Service
↓
Tauri Command
↓
Rust
```

---

# Core Modules

## 001 Foundation

Project setup and architecture.

---

## 002 Inventory

- Products
- Services
- Stock Management
- Categories
- Units
- Low Stock

---

## 003 Suppliers

- Suppliers
- Supplier Ledger
- Supplier Balances

---

## 004 Purchases

- Purchase Invoices
- Purchase Items
- Stock Inward
- Payables

---

## 005 POS

- Sales Invoices
- Barcode Scanning
- Payment Processing
- Receipt Printing
- Keyboard Shortcuts

---

## 006 Expenses

- Expense Categories
- Operational Expenses
- Monthly Expenses

---

## 007 Reports

- Dashboard
- Sales Reports
- Product Reports
- Supplier Reports
- Profit & Loss

---

## 008 Settings

- Store Information
- Taxes
- Currency
- Receipts
- Themes
- Languages
- POS Configuration

---

## 009 Backup & Restore

- Manual Backups
- Automatic Backups
- Restore
- Import/Export

---

## 010 Printing

- Thermal Receipts
- Purchase Printing
- Report Printing
- Printer Management

---

## 011 Packaging & Installer

- Windows Installer
- Portable Build
- Updates
- Database Migrations
- Recovery

---

# Development Workflow

Before implementing any feature:

1. Read README.md
2. Read IMPLEMENTATION_WORKFLOW.md
3. Read ARCHITECTURE_GUARDRAILS.md
4. Read target module specifications

Do not start coding before reading the specifications.

---

# Specifications

```text
specs/
  IMPLEMENTATION_WORKFLOW.md
  ARCHITECTURE_GUARDRAILS.md
  AGENT_STARTUP_CHECKLIST.md

  001-foundation/
  002-inventory-module/
  003-suppliers-module/
  004-purchases-module/
  005-pos-module/
  006-expenses-module/
  007-reports-module/
  008-settings-module/
  009-backup-restore-module/
  010-printing-module/
  011-packaging-installer-module/
```

---

# Commands

Install dependencies:

```bash
npm install
```

Run web application:

```bash
npm run dev
```

Run desktop application:

```bash
npm run tauri dev
```

Type checking:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

Desktop build:

```bash
npm run tauri build
```

---

# Definition Of Done

A task is complete only if:

- Requirements implemented
- Architecture respected
- Types implemented
- Validation implemented
- Translations added
- Build passes
- Typecheck passes
- Lint passes
- todo-list updated
- No architecture violations

---

# RetailX Philosophy

**Fast. Offline. Reliable.**

Build software that keeps stores running even when the internet does not.