"use client";

import { useEffect, useEffectEvent, useState } from "react";

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

export function useDashboardWorkspace() {
  const store = useFinanceStore();
  const [rateState, setRateState] = useState<RateState>(initialRateState);

  const currencyOption = getCurrencyOption(store.currency);
  const exchangeRate = rateState.rates[store.currency] ?? 1;
  const totals = getFinancialTotals(store.transactions);
  const categories = getAvailableCategories(store.transactions);
  const monthlySeries = getMonthlyBalanceSeries(store.transactions);
  const expenseBreakdown = getExpenseBreakdown(store.transactions);
  const filteredTransactions = getFilteredTransactions(
    store.transactions,
    store.filters
  );
  const rateStatusLabel =
    store.currency === BASE_CURRENCY
      ? "Using the dashboard base currency."
      : rateState.status === "ready" && rateState.date
        ? `Latest rate from ${formatShortDate(rateState.date)}.`
        : rateState.status === "error"
          ? "Live rate unavailable, using the latest cached selection."
          : "Refreshing the latest market reference rate.";
  const insights = getInsightCards(store.transactions, {
    formatMoney: (value) =>
      formatCurrency(convertFromUsd(value, exchangeRate), {
        currency: store.currency,
        locale: currencyOption.locale,
      }),
  });

  const syncTheme = useEffectEvent((nextTheme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
  });

  useEffect(() => {
    syncTheme(store.theme);
  }, [store.theme]);

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

  return {
    ...store,
    categories,
    currencyOption,
    exchangeRate,
    expenseBreakdown,
    filteredTransactions,
    insights,
    monthlySeries,
    rateState,
    rateStatusLabel,
    totals,
  };
}
