import type { CurrencyCode } from "@/lib/finance-types";

export const BASE_CURRENCY: CurrencyCode = "USD";

export interface CurrencyOption {
  code: CurrencyCode;
  locale: string;
  country: string;
  label: string;
}

export interface LatestRatesResult {
  base: CurrencyCode;
  date: string;
  rates: Partial<Record<CurrencyCode, number>>;
}

export const supportedCurrencies: CurrencyOption[] = [
  { code: "INR", locale: "en-IN", country: "India", label: "Indian Rupee" },
  { code: "USD", locale: "en-US", country: "United States", label: "US Dollar" },
  { code: "EUR", locale: "de-DE", country: "Eurozone", label: "Euro" },
  { code: "GBP", locale: "en-GB", country: "United Kingdom", label: "British Pound" },
  { code: "JPY", locale: "ja-JP", country: "Japan", label: "Japanese Yen" },
  { code: "CAD", locale: "en-CA", country: "Canada", label: "Canadian Dollar" },
  { code: "AUD", locale: "en-AU", country: "Australia", label: "Australian Dollar" },
  { code: "SGD", locale: "en-SG", country: "Singapore", label: "Singapore Dollar" },
  { code: "AED", locale: "en-AE", country: "United Arab Emirates", label: "UAE Dirham" },
];

export function getCurrencyOption(code: CurrencyCode) {
  return (
    supportedCurrencies.find((currency) => currency.code === code) ??
    supportedCurrencies[0]
  );
}

export function convertFromUsd(amount: number, rate: number) {
  return amount * rate;
}

export function convertToUsd(amount: number, rate: number) {
  return rate === 0 ? amount : amount / rate;
}

export async function fetchLatestRates(): Promise<LatestRatesResult> {
  const symbols = supportedCurrencies
    .map((currency) => currency.code)
    .filter((code) => code !== BASE_CURRENCY)
    .join(",");

  const response = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${BASE_CURRENCY}&symbols=${symbols}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Rate request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    base: CurrencyCode;
    date: string;
    rates: Record<string, number>;
  };

  return {
    base: data.base,
    date: data.date,
    rates: {
      USD: 1,
      ...Object.fromEntries(
        Object.entries(data.rates).map(([code, value]) => [code as CurrencyCode, value])
      ),
    },
  };
}
