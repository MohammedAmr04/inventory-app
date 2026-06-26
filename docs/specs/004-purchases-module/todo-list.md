# /specs/004-purchases-module/todo-list.md

# Purchases Progress — Completed

## Database
- [x] `purchase_invoices` table
- [x] `purchase_items` table
- [x] Indexes (invoice_number, supplier_id, purchase_date, product_id)

## Types
- [x] PurchaseInvoice, PurchaseItem, CreatePurchaseInvoiceInput
- [x] CreatePurchaseItemInput, PurchaseFilters, CartItem, PaginatedResult

## Schemas (Zod)
- [x] createPurchaseItemSchema
- [x] createPurchaseInvoiceSchema (with nested items validation)

## Repositories
- [x] PurchaseInvoiceRepository (findAll with joins/filter/sort/paginate, findById, search, create, update)
- [x] PurchaseItemRepository (findByInvoiceId with product join, create, deleteByInvoiceId)

## Services
- [x] PurchaseInvoiceService (transactional create: insert invoice → items → increment stock → if due > 0: update supplier balance + create ledger entry)
- [x] PurchaseCalculationService (subtotal, line total, total amount, due amount)

## API Routes
- [x] `/api/purchases` (GET with filters, POST with transactional create)
- [x] `/api/purchases/items` (GET by invoice ID)

## Stores (Zustand)
- [x] Purchases Store (filters with pagination/sort/date range)
- [x] Purchase Cart Store (add/remove/update quantity/update price/clear)

## Hooks (TanStack Query)
- [x] usePurchases (list + create, invalidates products on success)
- [x] usePurchase (single by ID)
- [x] usePurchaseSearch (mutation for search)
- [x] usePurchaseItems (items by invoice ID)
- [x] usePurchaseCalculations (memoized subtotal/total/due)
- [x] usePurchaseHistory (list wrapper)

## Components (shadcn/ui)
- [x] Purchase Invoices Table (status badges: Paid/Partial/Credit, pagination)
- [x] Purchase Form (supplier select, product search, editable cart table, summary)
- [x] Purchase Items Table (read-only items display)
- [x] Purchase Summary Card (subtotal, discount, total, paid, due)
- [x] Purchase Filters (search, date range, sort)
- [x] Purchase Details Card (invoice #, supplier, date, notes)

## Pages
- [x] /purchases (list with filters + new/view actions)
- [x] /purchases/new (create with form + cart)
- [x] /purchases/[id] (detail with items + summary)
- [x] /purchases/history (filterable history)

## Translations
- [x] en.json (32 purchase keys)
- [x] ar.json (32 purchase keys)

## Build
- [x] TypeScript (tsc --noEmit passes)
- [x] ESLint (0 errors)
- [x] next build (51 pages, 11 API routes)

---

## Pending (Future)

### Printing
- [ ] Purchase Print Service
- [ ] Print Purchase Invoice Action

### Verification
- [ ] Purchase Invoice Creation
- [ ] Stock Updates
- [ ] Partial Payment
- [ ] Supplier Balance Updates
- [ ] Ledger Entries
