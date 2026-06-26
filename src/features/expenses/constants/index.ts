export const SEED_CATEGORIES = [
  "Rent",
  "Utilities",
  "Salaries",
  "Transportation",
  "Internet",
  "Maintenance",
  "Miscellaneous",
];

export const DEFAULT_PAGE_SIZE = 20;

export const SORT_OPTIONS = [
  { value: "expenseDate", labelKey: "expenses.sortByDate" },
  { value: "amount", labelKey: "expenses.sortByAmount" },
  { value: "createdAt", labelKey: "expenses.sortByCreated" },
] as const;
