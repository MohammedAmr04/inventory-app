export interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  taxName: string;
  taxRate: number;
  currencySymbol: string;
  currencyCode: string;
  receiptFooter: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "",
  storePhone: "",
  storeEmail: "",
  storeAddress: "",
  taxName: "Tax",
  taxRate: 0,
  currencySymbol: "$",
  currencyCode: "USD",
  receiptFooter: "",
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: "admin" | "staff";
}

export const SETTINGS_KEYS: Record<keyof StoreSettings, string> = {
  storeName: "store_name",
  storePhone: "store_phone",
  storeEmail: "store_email",
  storeAddress: "store_address",
  taxName: "tax_name",
  taxRate: "tax_rate",
  currencySymbol: "currency_symbol",
  currencyCode: "currency_code",
  receiptFooter: "receipt_footer",
};

export const STORE_SETTINGS_KEYS = Object.values(SETTINGS_KEYS);
