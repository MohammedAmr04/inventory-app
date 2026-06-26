import type { PaymentMethod } from "../types";

export const PAYMENT_METHODS: { value: PaymentMethod; labelKey: string }[] = [
  { value: "cash", labelKey: "pos.paymentCash" },
  { value: "card", labelKey: "pos.paymentCard" },
  { value: "mixed", labelKey: "pos.paymentMixed" },
];

export const DEFAULT_PAGE_SIZE = 20;

export const SORT_OPTIONS = [
  { value: "createdAt", labelKey: "pos.sortByDate" },
  { value: "netTotal", labelKey: "pos.sortByTotal" },
] as const;

export const SHORTCUTS = [
  { key: "F1", actionKey: "pos.shortcutFocusSearch" },
  { key: "F2", actionKey: "pos.shortcutHold" },
  { key: "F3", actionKey: "pos.shortcutPrint" },
  { key: "F4", actionKey: "pos.shortcutClear" },
  { key: "F12", actionKey: "pos.shortcutPay" },
] as const;
