# /specs/002-inventory-module/todo-list.md

# Inventory Progress — Completed

## Database
- [x] Schema (categories, units, products, stock_adjustments)

## Types
- [x] All TypeScript types (Unit, Category, Product, StockAdjustment, etc.)

## Repositories
- [x] Unit Repository
- [x] Category Repository
- [x] Product Repository (with joins, search, barcode, pagination, low-stock)
- [x] Stock Adjustment Repository

## Services
- [x] Unit Service
- [x] Category Service
- [x] Product Service
- [x] Stock Adjustment Service (with transactional stock update)
- [x] Barcode Service
- [x] Low Stock Service

## Zod Schemas
- [x] Unit create/update schemas
- [x] Category create/update schemas
- [x] Product create/update schemas
- [x] Stock Adjustment create schema

## Stores (Zustand)
- [x] Inventory Store (filters)
- [x] Barcode Store
- [x] Stock Adjustment Store

## Hooks (TanStack Query)
- [x] useUnits (CRUD)
- [x] useCategories (CRUD)
- [x] useProducts (CRUD + filters)
- [x] useLowStock + useLowStockCount
- [x] useStockAdjustments

## API Routes
- [x] /api/inventory/units (GET, POST, PUT, DELETE)
- [x] /api/inventory/categories (GET, POST, PUT, DELETE)
- [x] /api/inventory/products (GET, POST, PUT, DELETE)
- [x] /api/inventory/stock-adjustments (GET, POST)
- [x] /api/inventory/low-stock (GET)

## Components (shadcn/ui)
- [x] Unit Form
- [x] Units Table
- [x] Category Form
- [x] Categories Table
- [x] Product Form (with conditional fields for physical/service)
- [x] Products Table (paginated)
- [x] Stock Adjustment Form
- [x] Low Stock Card
- [x] Barcode Input

## Pages
- [x] /inventory (hub)
- [x] /inventory/units
- [x] /inventory/categories
- [x] /inventory/products
- [x] /inventory/stock-adjustments
- [x] /inventory/low-stock

## Translations
- [x] en.json (full inventory keys)
- [x] ar.json (full inventory keys)

## Build
- [x] TypeScript (tsc --noEmit passes)
- [x] ESLint (0 errors)
- [x] next build (all 37 pages, 5 dynamic API routes)

---

## Pending (Future)

### Import & Export
- [ ] Import Service
- [ ] Export Service
- [ ] Import UI
- [ ] Export UI

### Barcode
- [ ] Scanner Integration (hardware barcode scanner)
