# RetailX Architecture Guardrails

## Purpose

This document defines the non-negotiable architecture rules for RetailX.

All contributors, AI agents, and developers MUST follow these rules.

Violation of these rules is considered an implementation failure.

---

# Tech Stack

Frontend:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Ionic React
- shadcn/ui
- next-intl
- Zustand
- React Hook Form
- Zod

Desktop:
- Tauri v2
- Rust Commands

Database:
- SQLite
- Drizzle ORM

---

# Source Structure

src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── stores/
├── types/
├── constants/
├── messages/
├── specs/

src-tauri/
├── src/
├── capabilities/
├── icons/
├── bundles/

This structure is fixed.

Do not create new top-level folders unless the architecture specification explicitly requires it.

---

# Architecture Layers

All business flows must follow:

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
Database

Never bypass layers.

---

# Responsibilities

## Pages

Location:

app/

Responsibilities:

- Routing
- Layout composition
- Feature composition
- Search params
- Navigation

Pages must NOT contain:

- Database access
- Business logic
- Validation logic
- Data transformation
- Native integrations

---

## Components

Location:

components/
features/*/components/

Responsibilities:

- Rendering
- Events
- Accessibility
- Composition

Components must NOT contain:

- SQLite access
- Tauri commands
- Business rules
- Complex calculations

Components must be dumb whenever possible.

---

## Hooks

Location:

hooks/
features/*/hooks/

Responsibilities:

- UI state orchestration
- Component state
- Event handling
- Calling services

Hooks must NOT:

- Execute SQL
- Access Drizzle directly
- Access SQLite directly
- Contain native integrations

---

## Stores

Location:

stores/
features/*/stores/

Responsibilities:

- UI state
- Filters
- Selections
- Preferences
- Temporary state

Stores must NOT:

- Execute database operations
- Call Tauri commands
- Contain business calculations

Database state is not UI state.

---

## Services

Location:

features/*/services/

Responsibilities:

- Business rules
- Validation
- Orchestration
- Transactions
- Error handling

Services may:

- Call repositories
- Call Tauri commands
- Write logs

Services must NOT:

- Render UI
- Import pages
- Import components

---

## Repositories

Location:

features/*/repositories/

Responsibilities:

- Database queries
- Data persistence
- Mapping entities

Repositories are the ONLY layer allowed to access:

- Drizzle
- SQLite

Repositories must NOT:

- Import UI
- Import hooks
- Import components

---

# Database Rules

Allowed:

Repository
↓
Drizzle
↓
SQLite

Forbidden:

Page
↓
SQLite

Component
↓
SQLite

Hook
↓
SQLite

Store
↓
SQLite

Service
↓
SQLite

---

# Native APIs Rules

Native features:

- Printing
- Barcode Scanner
- Filesystem
- Backups
- Window APIs
- Dialog APIs

Must always flow through:

Component
↓
Hook
↓
Service
↓
Tauri Command
↓
Rust

Never access browser-only APIs if Tauri already provides a native implementation.

---

# Shared Components Rules

Reusable components:

components/
  ui/
  forms/
  tables/
  feedback/
  layouts/

Feature-specific components:

features/<feature>/components/

Never place feature components inside shared folders.

---

# Localization Rules

No hardcoded strings.

Always use:

messages/
  en.json
  ar.json

Workflow:

1. Search translation keys.
2. Add missing keys.
3. Use next-intl.

Forbidden:

<Button>
  Save
</Button>

Allowed:

<Button>
  {t("common.save")}
</Button>

---

# Validation Rules

Every form requires:

- Zod schema
- React Hook Form
- Typed form values
- Error messages
- Default values

Validation belongs inside:

features/*/schemas/

Validation must NOT live inside components.

---

# State Management Rules

Global state:

stores/

Feature state:

features/*/stores/

Never duplicate state.

Single source of truth must exist.

Avoid:

selectedProduct
selectedProductId
currentProduct
activeProduct

Choose one representation.

---

# Import Rules

Allowed:

feature
↓
shared

Forbidden:

shared
↓
feature

Allowed:

feature
↓
feature public APIs

Forbidden:

feature
↓
feature internals

Example:

GOOD

features/inventory/index.ts

export:
- types
- hooks
- services

BAD

import:
features/inventory/components/product-form

---

# Barrel Export Rules

Every feature should expose a public API:

features/
  inventory/
    index.ts
  suppliers/
    index.ts
  purchases/
    index.ts

Internal implementation should remain private.

---

# Styling Rules

Priority:

1. Ionic Components
2. shadcn/ui
3. Tailwind Utilities

Avoid:

- CSS files
- Inline styles
- Custom design systems

Use design tokens.

---

# Error Handling Rules

Every service must:

- validate input
- catch failures
- return typed errors
- log errors

Use:

lib/logger/

Never swallow exceptions.

---

# Performance Rules

Prefer:

- React.memo
- useMemo
- useCallback
- Virtualized tables
- Lazy loading
- Debounced search
- Database indexes

Avoid:

- unnecessary rerenders
- duplicated state
- duplicated queries
- large context providers

---

# File Naming Rules

Components:
kebab-case

Examples:

product-form.tsx
products-table.tsx

Hooks:

use-products.ts
use-pos-shortcuts.ts

Stores:

inventory-store.ts
pos-store.ts

Services:

inventory.service.ts
receipt-print.service.ts

Repositories:

inventory.repository.ts
sales.repository.ts

Schemas:

product.schema.ts
supplier.schema.ts

Types:

product.types.ts
invoice.types.ts

---

# Before Starting Any Module

Read:

1. README.md
2. IMPLEMENTATION_WORKFLOW.md
3. ARCHITECTURE.md
4. requirements.md
5. architecture.md
6. database.md
7. tasks.md
8. todo-list.md

Do not code before reading all documents.

---

# Before Completing Any Task

Verify:

✓ Architecture respected
✓ Types implemented
✓ Validation implemented
✓ Translations added
✓ Build passes
✓ Lint passes
✓ Typecheck passes
✓ todo-list updated
✓ No hardcoded strings
✓ No architecture violations

Commands:

npm run lint
npm run typecheck
npm run build
cargo check

---

# Forbidden Actions

DO NOT:

❌ Skip specifications
❌ Skip phases
❌ Skip translations
❌ Skip validation
❌ Add top-level folders
❌ Access SQLite outside repositories
❌ Put business logic inside components
❌ Create duplicate services
❌ Refactor unrelated modules
❌ Import feature internals directly
❌ Introduce hardcoded strings
❌ Ignore todo-list updates
❌ Bypass Tauri commands
❌ Introduce global mutable state

---

# Definition Of Done

Implementation is complete only when:

✓ Requirements implemented
✓ Architecture respected
✓ Database implemented
✓ Services implemented
✓ Repositories implemented
✓ Components implemented
✓ Pages implemented
✓ Translations added
✓ Tests pass
✓ Build passes
✓ Lint passes
✓ Typecheck passes
✓ todo-list updated
✓ No guardrail violations