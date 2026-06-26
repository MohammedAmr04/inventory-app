import "server-only";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("staff"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const units = sqliteTable("units", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  barcode: text("barcode"),
  type: text("type", { enum: ["physical", "service"] }).notNull().default("physical"),
  categoryId: integer("category_id").references(() => categories.id),
  unitId: integer("unit_id").references(() => units.id),
  costPrice: real("cost_price").notNull().default(0),
  salePrice: real("sale_price").notNull().default(0),
  stock: real("stock").notNull().default(0),
  lowStockThreshold: real("low_stock_threshold").default(0),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const stockAdjustments = sqliteTable("stock_adjustments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id),
  type: text("type", { enum: ["increase", "decrease", "set"] }).notNull(),
  quantity: real("quantity").notNull(),
  previousStock: real("previous_stock").notNull(),
  newStock: real("new_stock").notNull(),
  reason: text("reason"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  notes: text("notes"),
  currentBalance: real("current_balance").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const supplierPayments = sqliteTable("supplier_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
  amount: real("amount").notNull(),
  paymentDate: text("payment_date").notNull().default("CURRENT_TIMESTAMP"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const supplierLedger = sqliteTable("supplier_ledger", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
  referenceType: text("reference_type", { enum: ["purchase_invoice", "payment", "manual_adjustment"] }).notNull(),
  referenceId: integer("reference_id"),
  amount: real("amount").notNull(),
  balanceAfter: real("balance_after").notNull(),
  description: text("description"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const purchaseInvoices = sqliteTable("purchase_invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  subtotal: real("subtotal").notNull().default(0),
  discount: real("discount").notNull().default(0),
  totalAmount: real("total_amount").notNull().default(0),
  paidAmount: real("paid_amount").notNull().default(0),
  dueAmount: real("due_amount").notNull().default(0),
  notes: text("notes"),
  purchaseDate: text("purchase_date").notNull().default("CURRENT_TIMESTAMP"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const purchaseItems = sqliteTable("purchase_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purchaseInvoiceId: integer("purchase_invoice_id").notNull().references(() => purchaseInvoices.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: real("quantity").notNull(),
  purchasePrice: real("purchase_price").notNull(),
  lineTotal: real("line_total").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});
