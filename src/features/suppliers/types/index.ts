export interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  currentBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPayment {
  id: number;
  supplierId: number;
  amount: number;
  paymentDate: string;
  notes: string | null;
  createdAt: string;
  supplierName?: string | null;
}

export interface SupplierLedgerEntry {
  id: number;
  supplierId: number;
  referenceType: "purchase_invoice" | "payment" | "manual_adjustment";
  referenceId: number | null;
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

export interface CreateSupplierInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CreateSupplierPaymentInput {
  supplierId: number;
  amount: number;
  paymentDate?: string;
  notes?: string;
}

export interface SupplierFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "currentBalance" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface SupplierAnalytics {
  totalSuppliers: number;
  totalOutstandingPayables: number;
  topDebtors: (Supplier & { totalPurchases: number })[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
