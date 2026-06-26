export type PaperSize = "80mm" | "58mm";

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ReceiptData {
  storeName: string;
  storePhone: string;
  storeAddress: string;
  receiptFooter: string;
  invoiceNumber: string;
  date: string;
  customerName?: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  tax: number;
  taxName: string;
  taxRate: number;
  netTotal: number;
  paymentMethod: string;
  cashReceived?: number;
  changeAmount?: number;
}

export interface PrintSettings {
  paperSize: PaperSize;
  copies: number;
}
