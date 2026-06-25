# RetailX Implementation Workflow

## Objective

Implement RetailX incrementally by following the specifications inside `/specs`.

The system is an offline-first Desktop Application built with:

- Next.js 15 (App Router)
- TypeScript
- Tauri v2
- Ionic React Components
- Tailwind CSS
- shadcn/ui
- SQLite
- Drizzle ORM
- Zustand
- React Hook Form
- Zod
- next-intl

The implementation order is mandatory.

Never skip dependencies.

---

# General Rules

Before starting any module:

1. Read `/README.md`
2. Read `/specs/IMPLEMENTATION_WORKFLOW.md`
3. Read `/specs/ARCHITECTURE.md`
4. Read all files inside the target module:
   - requirements.md
   - architecture.md
   - database.md
   - tasks.md
   - todo-list.md

Do not start coding before understanding all documents.

---

# Development Principles

## Architecture First

Always preserve the architecture.

Never place business logic inside pages or components.

Correct flow:

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

---

## Feature Isolation

Every feature must remain isolated.

Example:

features/
  inventory/
  suppliers/
  purchases/
  pos/

Never import internal implementation details between features.

Only expose public services and types.

---

## Shared Components

Reusable components belong in:

components/
  ui/
  forms/
  tables/
  feedback/
  layouts/

Feature-specific components belong inside:

features/<feature>/components/

---

## State Management

Global State:

stores/

Feature State:

features/<feature>/stores/

Never put server/database state inside UI state.

---

## Database Rules

Database access is allowed only inside repositories.

Never access SQLite directly from:

- pages
- components
- hooks
- stores

Correct:

Component
↓
Hook
↓
Service
↓
Repository
↓
SQLite

Wrong:

Component
↓
SQLite

---

## Validation Rules

Forms:

React Hook Form
+
Zod

Every form requires:

schema
default values
submit handler
error handling

---

## Localization Rules

No hardcoded strings.

All UI text must use:

messages/
  en.json
  ar.json

Always:

1. Check translation keys.
2. Create missing keys.
3. Use next-intl.

---

## Styling Rules

Use:

1. Ionic Components
2. shadcn/ui
3. Tailwind

Priority:

Business Components
↓
Ionic
↓
shadcn
↓
Tailwind utilities

Avoid custom CSS whenever possible.

---

## Desktop Rules

Desktop integrations must go through Tauri commands.

Examples:

Barcode Scanner
Printer
Filesystem
Backups
Window APIs

Never use browser-only APIs for native features.

---

## Error Handling

Every service must:

validate input
catch failures
return typed errors
write logs

Use:

lib/logger/

---

## Performance Rules

Prefer:

memoization
virtualized tables
debounced search
lazy loading
database indexes

Avoid:

unnecessary rerenders
large state objects
duplicate queries

---

# Implementation Order

The order is mandatory.

---

## Phase 1

001 Foundation

Tasks:

- Create folders
- Configure aliases
- Configure Tailwind
- Configure Ionic
- Configure shadcn
- Configure next-intl
- Configure Zustand
- Configure Drizzle
- Configure SQLite
- Configure Tauri
- Configure Logger
- Configure Theme Provider

Stop.

Verify application starts.

---

## Phase 2

002 Inventory

Order:

Database
Types
Repositories
Services
Stores
Hooks
Components
Pages
Validation
Translations
Testing

Stop.

Update todo-list.md

---

## Phase 3

003 Suppliers

Order:

Database
Types
Repositories
Services
Stores
Hooks
Components
Pages
Validation
Translations
Testing

Stop.

Update todo-list.md

---

## Phase 4

004 Purchases

Order:

Database
Types
Repositories
Services
Stores
Hooks
Components
Pages
Validation
Translations
Testing

Stop.

Update todo-list.md

---

## Phase 5

005 POS

Order:

Database
Types
Repositories
Services
Stores
Hooks
Components
Pages
Validation
Translations
Testing

Stop.

Update todo-list.md

---

## Phase 6

006 Expenses

Order:

Database
Types
Repositories
Services
Stores
Hooks
Components
Pages
Validation
Translations
Testing

Stop.

Update todo-list.md

---

## Phase 7

007 Reports

Order:

Queries
Repositories
Services
Stores
Hooks
Components
Pages
Charts
Translations
Testing

Stop.

Update todo-list.md

---

## Phase 8

008 Settings

Order:

Database
Repositories
Services
Stores
Hooks
Components
Pages
Translations
Testing

Stop.

Update todo-list.md

---

## Phase 9

009 Backup & Restore

Order:

Filesystem
Repositories
Services
Stores
Hooks
Components
Pages
Testing

Stop.

Update todo-list.md

---

## Phase 10

010 Printing

Order:

Printer Service
Templates
Repositories
Stores
Hooks
Components
Pages
Testing

Stop.

Update todo-list.md

---

## Phase 11

011 Packaging & Installer

Order:

Bootstrap
Database Migration
Recovery
Updater
Installer
Portable Build
Testing

Stop.

Update todo-list.md

---

# Completion Rules

After every completed task:

1. Mark completed items in tasks.md
2. Update todo-list.md
3. Create migration if database changed
4. Create translations
5. Verify build passes
6. Verify lint passes
7. Verify typecheck passes

Commands:

npm run lint
npm run typecheck
npm run build
cargo check

---

# Forbidden

Do not:

- Skip phases
- Skip specs
- Skip translations
- Skip validation
- Put business logic inside components
- Access SQLite directly from UI
- Introduce hardcoded strings
- Create duplicate services
- Refactor unrelated modules

---

# Definition of Done

A task is complete only if:

✓ Code implemented
✓ Types implemented
✓ Validation implemented
✓ Translations added
✓ Tests pass
✓ Build passes
✓ Lint passes
✓ todo-list updated
✓ No architecture violations