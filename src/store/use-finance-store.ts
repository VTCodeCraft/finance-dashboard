"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { seedTransactions } from "@/lib/finance-data";
import { getTodayDateInputValue } from "@/lib/finance-format";
import type {
  CurrencyCode,
  FinanceFilters,
  ThemeMode,
  Transaction,
  TransactionDraft,
  TransactionSortBy,
  TransactionTypeFilter,
  UserRole,
} from "@/lib/finance-types";

const defaultFilters: FinanceFilters = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortDirection: "desc",
};

function createTransactionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

interface FinanceStoreState {
  transactions: Transaction[];
  role: UserRole;
  theme: ThemeMode;
  currency: CurrencyCode;
  filters: FinanceFilters;
  hasHydrated: boolean;
  setRole: (role: UserRole) => void;
  setCurrency: (currency: CurrencyCode) => void;
  addTransaction: (transaction: TransactionDraft) => void;
  deleteTransaction: (transactionId: string) => void;
  resetDemoData: () => void;
  setSearch: (search: string) => void;
  setTypeFilter: (type: TransactionTypeFilter) => void;
  setCategoryFilter: (category: string) => void;
  setSort: (sortBy: TransactionSortBy) => void;
  clearFilters: () => void;
  toggleTheme: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useFinanceStore = create<FinanceStoreState>()(
  persist(
    (set) => ({
      transactions: seedTransactions,
      role: "viewer",
      theme: "light",
      currency: "USD",
      filters: defaultFilters,
      hasHydrated: false,
      setRole: (role) => set({ role }),
      setCurrency: (currency) => set({ currency }),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              id: createTransactionId(),
              ...transaction,
              date: transaction.date || getTodayDateInputValue(),
              amount: Number(transaction.amount),
            },
            ...state.transactions,
          ],
        })),
      deleteTransaction: (transactionId) =>
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== transactionId
          ),
        })),
      resetDemoData: () =>
        set({
          transactions: seedTransactions,
          filters: defaultFilters,
        }),
      setSearch: (search) =>
        set((state) => ({
          filters: {
            ...state.filters,
            search,
          },
        })),
      setTypeFilter: (type) =>
        set((state) => ({
          filters: {
            ...state.filters,
            type,
          },
        })),
      setCategoryFilter: (category) =>
        set((state) => ({
          filters: {
            ...state.filters,
            category,
          },
        })),
      setSort: (sortBy) =>
        set((state) => {
          const sameField = state.filters.sortBy === sortBy;
          const sortDirection = sameField
            ? state.filters.sortDirection === "desc"
              ? "asc"
              : "desc"
            : "desc";

          return {
            filters: {
              ...state.filters,
              sortBy,
              sortDirection,
            },
          };
        }),
      clearFilters: () =>
        set((state) => ({
          filters: {
            ...defaultFilters,
            sortBy: state.filters.sortBy,
            sortDirection: state.filters.sortDirection,
          },
        })),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "finance-dashboard-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
        currency: state.currency,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
