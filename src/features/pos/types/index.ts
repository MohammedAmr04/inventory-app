export type PaymentMethod = "cash" | "card" | "mixed";

export interface SaleInvoice {
  id: number;
  invoiceNumber: string;
  customerName: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  netTotal: number;
  paymentMethod: PaymentMethod;
  cashReceived: number | null;
  changeAmount: number | null;
  createdAt: string;
  updatedAt: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  salesInvoiceId: number;
  productId: number;
  quantity: number;
  salePrice: number;
  lineTotal: number;
  createdAt: string;
  productName: string | null;
  productBarcode: string | null;
}

export interface CartItem {
  productId: number;
  productName: string;
  barcode: string | null;
  quantity: number;
  salePrice: number;
  lineTotal: number;
}

export interface CreateSaleInput {
  items: Omit<CartItem, "productName" | "barcode">[];
  subtotal: number;
  discount: number;
  netTotal: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  customerName?: string;
}

export interface HeldInvoice {
  id: number;
  referenceNumber: string;
  subtotal: number;
  discount: number;
  tax: number;
  netTotal: number;
  createdAt: string;
  updatedAt: string;
  items?: HeldInvoiceItem[];
}

export interface HeldInvoiceItem {
  id: number;
  heldInvoiceId: number;
  productId: number;
  quantity: number;
  salePrice: number;
  lineTotal: number;
  createdAt: string;
  productName: string | null;
}

export interface SaleFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: PaymentMethod;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaymentInput {
  method: PaymentMethod;
  cashReceived?: number;
  cardAmount?: number;
}

export interface CreateHeldInvoiceInput {
  items: Omit<CartItem, "productName" | "barcode">[];
  subtotal: number;
  discount: number;
  netTotal: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
