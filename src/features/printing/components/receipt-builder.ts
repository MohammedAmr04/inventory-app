import type {
  ReceiptData,
  ReceiptItem,
} from "../types";

interface SaleInvoiceData {
  invoiceNumber: string;
  customerName?: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  netTotal: number;
  paymentMethod: string;
  cashReceived?: number | null;
  changeAmount?: number | null;
  createdAt: string;
  items?: Array<{
    productName: string | null;
    quantity: number;
    salePrice: number;
    lineTotal: number;
  }>;
}

interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeAddress: string;
  receiptFooter: string;
  taxName: string;
  taxRate: number;
}

export function buildReceiptData(
  invoice: SaleInvoiceData,
  store: StoreSettings
): ReceiptData {
  return {
    storeName: store.storeName || "RetailX",
    storePhone: store.storePhone || "",
    storeAddress: store.storeAddress || "",
    receiptFooter: store.receiptFooter || "",
    invoiceNumber: invoice.invoiceNumber,
    date: new Date(invoice.createdAt).toLocaleString(),
    customerName: invoice.customerName ?? undefined,
    items: (invoice.items ?? []).map((item) => ({
      name: item.productName ?? "Unknown",
      quantity: item.quantity,
      price: item.salePrice,
      total: item.lineTotal,
    })),
    subtotal: invoice.subtotal,
    discount: invoice.discount,
    tax: invoice.tax,
    taxName: store.taxName || "Tax",
    taxRate: store.taxRate || 0,
    netTotal: invoice.netTotal,
    paymentMethod: invoice.paymentMethod,
    cashReceived: invoice.cashReceived ?? undefined,
    changeAmount: invoice.changeAmount ?? undefined,
  };
}
