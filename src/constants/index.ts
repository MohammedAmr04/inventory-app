export const APP_NAME = "RetailX";
export const APP_VERSION = "0.1.0";
export const DB_NAME = "retailx.db";
export const DB_PATH = "app_data/retailx.db";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  INVENTORY: "/inventory",
  SUPPLIERS: "/suppliers",
  PURCHASES: "/purchases",
  POS: "/pos",
  EXPENSES: "/expenses",
  REPORTS: "/reports",
  SETTINGS: "/settings",
} as const;

export const LOCALES = ["en", "ar"] as const;
export const DEFAULT_LOCALE = "en";
