# AGENTS.md - AI Coding Agent Instructions

You are a Senior Frontend Engineer specializing in modern, clean React/Next.js applications.

## Project Overview

- Type: Modern Frontend Application
- Naming Convention: kebab-case for all files and components
- Goal: Build maintainable, performant, and well-structured UI

## Tech Stack

- Framework: Next.js 15+ App Router
- Language: TypeScript 5+ with strict mode
- Styling: Tailwind CSS + shadcn/ui + Radix UI
- Internationalization: next-intl (or project-defined i18n solution for AR/EN)
- Forms: React Hook Form + Zod
- State Management: TanStack Query (server state) + Zustand (client state)
- File Naming: kebab-case (example: user-profile.tsx, login-page.tsx)

## General Workflow

- Always think step-by-step.
- Read existing files before creating or modifying.
- Plan your changes before implementing.
- Keep changes focused and incremental.
- Never commit secrets or sensitive information.

Before creating or editing files:

1. Read the existing file.
2. Read related components.
3. Search for reusable implementations.
4. Plan changes.
5. Implement incrementally.

Never overwrite files without understanding their existing usage.

### Safety Rules

- Do not expose sensitive keys or credentials.
- Validate all inputs (especially forms).
- Follow accessibility best practices when creating UI.

### Code Quality

- Write clean, readable, and well-typed code.
- No `any` type.
- Use early returns and guard clauses.
- Max component size: try to keep under 250 lines.
- Add comments only for complex logic.

---

## Naming Conventions

- Components and files: **kebab-case** (user-profile.tsx, data-table.tsx)
- Folders: kebab-case (user-management, payment-gateway)
- Functions and variables: camelCase
- Types/Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE

## Architecture & Page Layout Rules

- **Server Components are the default.** Use "use client" only when necessary (hooks, browser APIs, state).
- Always await `params` and `searchParams` in Next.js 15+.
- Colocate `loading.tsx`, `error.tsx`, `not-found.tsx` when needed.
- Keep components focused and small.
- Prefer composition over complex inheritance.

### Section-Based Page Architecture (Strict Directories)

The root `page.tsx` must act strictly as a clean orchestrator/server data-fetcher that imports and mounts local section components.

**Do NOT** write raw inline UI layouts directly inside the root `page.tsx` file. Instead:

- Break every page down into logical sub-components (e.g., `welcome-banner.tsx`, `metrics-grid.tsx`).
- Create a local private folder named `_components` inside the exact directory of that page (e.g., `app/[locale]/dashboard/_components/`). All page-specific section files must live here.
- Global shared elements go into `components/common/` or `components/layouts/` instead.

### Page Composition Rules

page.tsx **should**:
- Fetch data
- Prepare server props
- Compose sections

page.tsx **must NOT**:
- Contain large JSX blocks
- Define table columns
- Define mock data
- Contain chart configurations
- Contain business logic

Move all UI sections into:
```
app/[locale]/<route>/_components/
```

### Client Component Rules

Do not add "use client" by default.

Use Client Components only for:

- useState, useEffect, useMemo, useCallback
- browser APIs
- event handlers
- TanStack Query hooks
- Zustand hooks
- Recharts
- form interactions

Everything else should remain Server Components.

---

## Reusability Rules

- Before creating any component, search the codebase for an existing reusable component.
- Prefer reusing components from:
  - components/common
  - components/ui
  - components/layouts
- Never duplicate existing components.
- Extend existing components via props instead of creating variants.

### Shared Components Priority

Always prefer using existing shared components:

- AppBreadcrumb
- StatsCard
- FilterSelect
- FilterTabs
- ProgressBar
- DataTableBuilder
- Pagination
- EmptyState
- ConfirmDialog
- LoadingState

Only create a new component if no suitable shared component exists.

---

## Styling & UI Rules

- Always use **shadcn/ui** components when possible.
- Use Tailwind classes from the project's design system.
- Prefer semantic color variables defined in global.css:
  - text-primary, text-muted-foreground, text-destructive
  - bg-background, bg-card, bg-muted, bg-accent
  - border-border, border-input
- Do not hardcode colors. Use the theme colors.
- Maintain consistency with the existing design system.

---

## Localization & Multi-language (i18n) Rules

- **Full RTL/LTR Support:** Always implement layout semantics that adapt automatically to direction switches (`rtl` for Arabic, `ltr` for English).
- **Dynamic Translation Hooks:** Hardcoded user-facing strings are strictly forbidden. All labels, placeholders, tooltips, and table headers must use translation hooks (`t('key')`).
- **Dictionary Organization:** Ensure every structural key mapped in the UI has an exact matching localized string in both `messages/en.json` and `messages/ar.json`.
- **Flexbox & Alignment Flexibility:** Use logical Tailwind spacing and positioning properties (e.g., `start` and `end` instead of `left` and `right`) to ensure text alignment flips perfectly between English and Arabic layouts.

### Translation Rules

Every new UI string must:

1. Be added to messages/en.json
2. Be added to messages/ar.json
3. Use translation hooks:
   - `useTranslations()` (client components)
   - `getTranslations()` (server components)

If a translation key is missing, create it automatically.

---

## Form Rules

All forms must use:

- React Hook Form
- Zod schema validation

Requirements:

- Controlled inputs
- Validation messages
- Loading states
- Disabled submit state
- Accessible labels
- Translation support

---


### Shared Rules

Do not build custom HTML tables unless explicitly requested.

Page files must NOT:

- Contain large table JSX blocks
- Implement manual pagination UIs
- Implement duplicated filter logic
- Rebuild table abstractions
- Mix DataTable and TableBuilder responsibilities

Page files should only:

1. Fetch data
2. Prepare configuration
3. Choose the appropriate table abstraction
4. Pass configuration into the table component
5. Compose surrounding sections

---

## Completion Checklist

Before finishing:

- No TypeScript errors
- No ESLint errors
- Imports are valid
- Translation keys exist in both en.json and ar.json
- Responsive layout verified
- Reused existing components (no duplicates)
- `npm run build` succeeds