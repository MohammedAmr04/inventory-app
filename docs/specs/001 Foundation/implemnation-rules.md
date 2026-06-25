# RetailX Development Rules

## Tech Stack

- Next.js 15 (App Router)
- TypeScript (Strict Mode)
- Tauri v2
- Ionic React
- SQLite
- Drizzle ORM
- Zustand
- TanStack Query
- React Hook Form
- Zod
- TailwindCSS

---

## General Rules

- Strict TypeScript only.
- Never use `any`.
- Never hardcode strings.
- All user-facing text must support localization.
- Prefer composition over inheritance.
- Keep business logic outside UI components.
- Every feature must be self-contained.

---

## Architecture Rules

Feature structure:

features/
  feature-name/
    components/
    hooks/
    services/
    repositories/
    schemas/
    stores/
    types/
    utils/

---

## State Management

Global State:
- Zustand

Server Cache:
- TanStack Query

Forms:
- React Hook Form
- Zod Resolver

---

## Database Rules

- Repository Pattern is mandatory.
- Services never access database directly.
- All database writes must be transactional.
- Soft delete when applicable.
- Every table contains:

id
createdAt
updatedAt

---

## UI Rules

- Ionic Components for shell and layout.
- Shared design system inside components/ui.
- Responsive desktop layouts.
- Keyboard accessibility required.
- Dark mode support required.

---

## Tauri Rules

Native capabilities must go through services:

lib/
  printer/
  scanner/
  filesystem/
  updater/
  backup/

UI must never call Tauri APIs directly.

---

## Code Quality Rules

- ESLint
- Prettier
- Husky
- lint-staged

Before commit:

npm run lint
npm run typecheck
npm run test

---

## Documentation Rules

Before implementing any module, the agent MUST read:

1. implementation-rules.md
2. requirements.md
3. architecture.md
4. tasks.md

After completing any task:

1. Update todo-list.md
2. Mark completed items
3. Add newly discovered tasks
4. Document blockers