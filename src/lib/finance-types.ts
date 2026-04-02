export type UserRole = "viewer" | "admin";

export type ThemeMode = "light" | "dark";

export type TransactionType = "income" | "expense";

export type CurrencyCode =
  | "USD"
  | "INR"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "SGD"
  | "AED";

export type TransactionSortBy = "date" | "amount";

export type SortDirection = "asc" | "desc";

export type TransactionTypeFilter = "all" | TransactionType;

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface TransactionDraft {
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface FinanceFilters {
  search: string;
  type: TransactionTypeFilter;
  category: string;
  sortBy: TransactionSortBy;
  sortDirection: SortDirection;
}
