"use client";

import { BadgeDollarSign, BanknoteArrowDown, BanknoteArrowUp, Globe, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent, formatShortDate } from "@/lib/finance-format";
import type { FinancialTotals } from "@/lib/finance-analytics";
import type { CurrencyCode, UserRole } from "@/lib/finance-types";

interface WalletOverviewProps {
  currency: CurrencyCode;
  currencyLocale: string;
  exchangeRate: number;
  exchangeRateDate: string | null;
  role: UserRole;
  totals: FinancialTotals;
}

export function WalletOverview({
  currency,
  currencyLocale,
  exchangeRate,
  exchangeRateDate,
  role,
  totals,
}: WalletOverviewProps) {
  const items = [
    {
      label: "Available balance",
      value: formatCurrency(totals.balance * exchangeRate, {
        compact: true,
        currency,
        locale: currencyLocale,
      }),
      description: "Current net amount available in the selected display currency.",
      icon: BadgeDollarSign,
    },
    {
      label: "Income flow",
      value: formatCurrency(totals.income * exchangeRate, {
        compact: true,
        currency,
        locale: currencyLocale,
      }),
      description: "Total tracked inflow across salary, refunds, and side work.",
      icon: BanknoteArrowUp,
    },
    {
      label: "Expense flow",
      value: formatCurrency(totals.expenses * exchangeRate, {
        compact: true,
        currency,
        locale: currencyLocale,
      }),
      description: "Tracked outflow converted using the latest available rate.",
      icon: BanknoteArrowDown,
    },
    {
      label: "Savings efficiency",
      value: formatPercent(totals.savingsRate),
      description: "How much of your tracked income remains after expenses.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Wallet
        </p>
        <h2 className="mt-2 font-heading text-3xl text-foreground">
          Currency and holdings
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.label}
              className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur"
            >
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-3 font-heading text-3xl text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                  <Icon className="size-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
        <CardHeader>
          <CardTitle>Wallet notes</CardTitle>
          <CardDescription>
            Reference details for the currently selected currency and access mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <Globe className="size-4 text-primary" />
              <span className="font-medium">Exchange rate</span>
            </div>
            <p className="mt-3 font-heading text-2xl text-foreground">
              1 USD ={" "}
              {formatCurrency(exchangeRate, {
                currency,
                locale: currencyLocale,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {exchangeRateDate
                ? `Latest reference from ${formatShortDate(exchangeRateDate)}.`
                : "Using the latest available reference rate."}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck className="size-4 text-primary" />
              <span className="font-medium">Role</span>
            </div>
            <p className="mt-3 font-heading text-2xl capitalize text-foreground">
              {role}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {role === "admin"
                ? "Can manage transactions and curate the dataset."
                : "Can review balances, charts, and insights only."}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <BadgeDollarSign className="size-4 text-primary" />
              <span className="font-medium">Display currency</span>
            </div>
            <p className="mt-3 font-heading text-2xl text-foreground">{currency}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              All cards, charts, and transaction amounts are rendered in this currency.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
