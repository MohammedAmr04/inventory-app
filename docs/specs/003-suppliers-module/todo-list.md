# /specs/003-suppliers-module/todo-list.md

# Suppliers Progress — Completed

## Database
- [x] `suppliers` table
- [x] `supplier_payments` table
- [x] `supplier_ledger` table
- [x] Indexes (name, phone, balance, supplier_id, reference_type, dates)

## Types
- [x] Supplier, SupplierPayment, SupplierLedgerEntry
- [x] CreateSupplierInput, UpdateSupplierInput, CreateSupplierPaymentInput
- [x] SupplierFilters, SupplierAnalytics, PaginatedResult

## Schemas (Zod)
- [x] createSupplierSchema / updateSupplierSchema
- [x] createSupplierPaymentSchema

## Repositories
- [x] SupplierRepository (findAll with search/sort/paginate, findById, search, create, update, archive, findTopDebtors)
- [x] SupplierPaymentRepository (findAll with joins, create)
- [x] SupplierLedgerRepository (findBySupplierId paginated, create)

## Services
- [x] SupplierService (CRUD + search + top debtors)
- [x] SupplierPaymentService (transactional: insert payment → update balance → insert ledger entry)
- [x] SupplierLedgerService (getBySupplierId)
- [x] SupplierAnalyticsService (total suppliers, outstanding payables, top 10 debtors)

## API Routes
- [x] `/api/suppliers` (GET, POST, PUT, DELETE)
- [x] `/api/suppliers/payments` (GET, POST)
- [x] `/api/suppliers/ledger` (GET)
- [x] `/api/suppliers/analytics` (GET)

## Stores (Zustand)
- [x] Suppliers Store (filters with page/sort/search)
- [x] Payments Store (selected supplier)
- [x] Ledger Store (selected supplier + pagination)

## Hooks (TanStack Query)
- [x] useSuppliers (list with filters + CRUD)
- [x] useSupplier (single by ID)
- [x] useSupplierPayments (list + create)
- [x] useSupplierLedger (paginated by supplier)
- [x] useTopDebts (analytics)

## Components (shadcn/ui)
- [x] Supplier Form
- [x] Suppliers Table (paginated with actions)
- [x] Supplier Details Card
- [x] Supplier Balance Card (debt/settled visual)
- [x] Payment Form
- [x] Supplier Ledger Table
- [x] Top Debt Card
- [x] Supplier Filters (search + sort)

## Pages
- [x] /suppliers (list + create/edit)
- [x] /suppliers/[id] (detail + payments + ledger)
- [x] /suppliers/payments (list + create)
- [x] /suppliers/top-debts

## Translations
- [x] en.json (28 supplier keys)
- [x] ar.json (28 supplier keys)

## Build
- [x] TypeScript (tsc --noEmit passes)
- [x] ESLint (0 errors)
- [x] next build (45 pages, 9 API routes)

---

## Pending (Future)

### Verification
- [ ] Supplier CRUD
- [ ] Search & filter
- [ ] Payment recording
- [ ] Balance updates
- [ ] Ledger entries
- [ ] Top debtors

### Integration
- [ ] Purchase Invoice integration (increase balance + ledger)
- [ ] Reports integration (supplier analytics)
