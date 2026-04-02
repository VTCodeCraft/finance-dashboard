import { BASE_CURRENCY, getCurrencyOption } from "@/lib/currency";
import type { CurrencyCode, TransactionType } from "@/lib/finance-types";

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

const precisePercentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

export function formatCurrency(
  value: number,
  options: {
    compact?: boolean;
    currency?: CurrencyCode;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
) {
  const currency = options.currency ?? BASE_CURRENCY;
  const locale = options.locale ?? getCurrencyOption(currency).locale;
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...(options.compact
        ? {
          notation: "compact",
          maximumFractionDigits: options.maximumFractionDigits ?? 1,
        }
      : {
          minimumFractionDigits: options.minimumFractionDigits,
          maximumFractionDigits: options.maximumFractionDigits ?? 0,
        }),
  });

  if (options.compact) {
    return formatter.format(value);
  }

  return formatter.format(value);
}

export function formatSignedCurrency(
  value: number,
  options: { currency?: CurrencyCode; locale?: string } = {}
) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatCurrency(Math.abs(value), options)}`;
}

export function formatPercent(value: number, precise = false) {
  const formatter = precise ? precisePercentFormatter : percentFormatter;
  return formatter.format(Number.isFinite(value) ? value : 0);
}

export function formatShortDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export function formatMonthLabel(value: string) {
  const [year, month] = value.split("-").map(Number);
  return monthFormatter.format(new Date(year, month - 1, 1));
}

export function formatTransactionTypeLabel(type: TransactionType) {
  return type === "income" ? "Income" : "Expense";
}

export function getTodayDateInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
