"use client";

import { useDeferredValue, useEffect, useEffectEvent, useState } from "react";
import { motion } from "framer-motion";

import {
  getAvailableCategories,
  getExpenseBreakdown,
  getFilteredTransactions,
  getFinancialTotals,
  getInsightCards,
  getMonthlyBalanceSeries,
} from "@/lib/finance-analytics";
import {
  BASE_CURRENCY,
  convertFromUsd,
  fetchLatestRates,
  getCurrencyOption,
  supportedCurrencies,
} from "@/lib/currency";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TransactionsSection } from "@/components/dashboard/transactions-section";
import { formatCurrency, formatShortDate } from "@/lib/finance-format";
import { useFinanceStore } from "@/store/use-finance-store";

interface RateState {
  rates: Partial<Record<(typeof supportedCurrencies)[number]["code"], number>>;
  date: string | null;
  status: "idle" | "loading" | "ready" | "error";
}

const initialRateState: RateState = {
  rates: {
    USD: 1,
  },
  date: null,
  status: "idle",
};

export function DashboardShell() {
  const {
    transactions,
    role,
    theme,
    currency,
    filters,
    hasHydrated,
    setRole,
    setCurrency,
    addTransaction,
    deleteTransaction,
    resetDemoData,
    setSearch,
    setTypeFilter,
    setCategoryFilter,
    setSort,
    clearFilters,
    toggleTheme,
  } = useFinanceStore();
  const [rateState, setRateState] = useState<RateState>(initialRateState);

  const deferredSearch = useDeferredValue(filters.search);
  const effectiveFilters = {
    ...filters,
    search: deferredSearch,
  };

  const totals = getFinancialTotals(transactions);
  const categories = getAvailableCategories(transactions);
  const monthlySeries = getMonthlyBalanceSeries(transactions);
  const expenseBreakdown = getExpenseBreakdown(transactions);
  const filteredTransactions = getFilteredTransactions(
    transactions,
    effectiveFilters
  );
  const currencyOption = getCurrencyOption(currency);
  const exchangeRate = rateState.rates[currency] ?? 1;
  const rateStatusLabel =
    currency === BASE_CURRENCY
      ? "Using the dashboard base currency."
      : rateState.status === "ready" && rateState.date
        ? `Latest rate from ${formatShortDate(rateState.date)}.`
        : rateState.status === "error"
          ? "Live rate unavailable, using the latest cached selection."
          : "Refreshing the latest market reference rate.";
  const insights = getInsightCards(transactions, {
    formatMoney: (value) =>
      formatCurrency(convertFromUsd(value, exchangeRate), {
        currency,
        locale: currencyOption.locale,
      }),
  });

  const syncTheme = useEffectEvent((nextTheme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
  });

  useEffect(() => {
    syncTheme(theme);
  }, [theme]);

  useEffect(() => {
    let isActive = true;

    async function loadRates() {
      setRateState((current) => ({
        ...current,
        status: current.date ? "ready" : "loading",
      }));

      try {
        const latestRates = await fetchLatestRates();

        if (!isActive) {
          return;
        }

        setRateState({
          rates: latestRates.rates,
          date: latestRates.date,
          status: "ready",
        });
      } catch {
        if (!isActive) {
          return;
        }

        setRateState((current) => ({
          ...current,
          status: "error",
        }));
      }
    }

    void loadRates();
    const intervalId = window.setInterval(() => {
      void loadRates();
    }, 60 * 60 * 1000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,154,163,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(210,156,83,0.15),transparent_28%)]" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <DashboardHeader
          role={role}
          theme={theme}
          currency={currency}
          currencyOptions={supportedCurrencies}
          currencyLocale={currencyOption.locale}
          exchangeRate={exchangeRate}
          exchangeRateDate={rateState.date}
          rateStatusLabel={rateStatusLabel}
          transactionCount={totals.transactionCount}
          balance={totals.balance}
          hasHydrated={hasHydrated}
          onRoleChange={setRole}
          onCurrencyChange={setCurrency}
          onToggleTheme={toggleTheme}
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-6"
        >
          <SummaryCards
            totals={totals}
            currency={currency}
            currencyLocale={currencyOption.locale}
            exchangeRate={exchangeRate}
          />
          <DashboardCharts
            monthlySeries={monthlySeries}
            expenseBreakdown={expenseBreakdown}
            currency={currency}
            currencyLocale={currencyOption.locale}
            exchangeRate={exchangeRate}
          />
          <InsightsPanel insights={insights} />
          <TransactionsSection
            transactions={transactions}
            filteredTransactions={filteredTransactions}
            categories={categories}
            role={role}
            currency={currency}
            filters={filters}
            exchangeRate={exchangeRate}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
            onResetDemoData={resetDemoData}
            onSearchChange={setSearch}
            onTypeFilterChange={setTypeFilter}
            onCategoryFilterChange={setCategoryFilter}
            onSortChange={setSort}
            onClearFilters={clearFilters}
          />
        </motion.div>
      </main>
    </div>
  );
}
