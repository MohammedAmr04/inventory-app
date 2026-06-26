export interface PurchaseInvoice {
  id: number;
  supplierId: number;
  invoiceNumber: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  notes: string | null;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  supplierName?: string | null;
}

export interface PurchaseItem {
  id: number;
  purchaseInvoiceId: number;
  productId: number;
  quantity: number;
  purchasePrice: number;
  lineTotal: number;
  createdAt: string;
  productName?: string | null;
}

export interface CreatePurchaseInvoiceInput {
  supplierId: number;
  invoiceNumber: string;
  subtotal: number;
  discount?: number;
  paidAmount?: number;
  notes?: string;
  purchaseDate?: string;
  items: CreatePurchaseItemInput[];
}

export interface CreatePurchaseItemInput {
  productId: number;
  quantity: number;
  purchasePrice: number;
  lineTotal: number;
}

export interface PurchaseFilters {
  search?: string;
  supplierId?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "purchaseDate" | "totalAmount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  purchasePrice: number;
  lineTotal: number;
  stock: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
