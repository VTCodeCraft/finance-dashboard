"use client";

import { ArrowDownCircle, ArrowUpCircle, Landmark, Scale, TrendingUp } from "lucide-react";

import { convertFromUsd } from "@/lib/currency";
import { formatCurrency, formatPercent } from "@/lib/finance-format";
import type { FinancialTotals } from "@/lib/finance-analytics";
import type { CurrencyCode } from "@/lib/finance-types";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardsProps {
  totals: FinancialTotals;
  currency: CurrencyCode;
  currencyLocale: string;
  exchangeRate: number;
}

const summaryAccentClasses = [
  "from-primary/16 via-primary/6 to-transparent",
  "from-chart-2/18 via-chart-2/8 to-transparent",
  "from-chart-5/16 via-chart-5/8 to-transparent",
  "from-chart-3/18 via-chart-3/8 to-transparent",
];

export function SummaryCards({
  totals,
  currency,
  currencyLocale,
  exchangeRate,
}: SummaryCardsProps) {
  const items = [
    {
      label: "Total balance",
      value: formatCurrency(convertFromUsd(totals.balance, exchangeRate), {
        compact: true,
        currency,
        locale: currencyLocale,
      }),
      description: "Net balance after subtracting expenses from income.",
      icon: Landmark,
      toneClass: "text-primary",
    },
    {
      label: "Total income",
      value: formatCurrency(convertFromUsd(totals.income, exchangeRate), {
        compact: true,
        currency,
        locale: currencyLocale,
      }),
      description: "All tracked money coming in across salary and side work.",
      icon: ArrowUpCircle,
      toneClass: "text-chart-2",
    },
    {
      label: "Total expenses",
      value: formatCurrency(convertFromUsd(totals.expenses, exchangeRate), {
        compact: true,
        currency,
        locale: currencyLocale,
      }),
      description: "Complete outflow across bills, essentials, and lifestyle spend.",
      icon: ArrowDownCircle,
      toneClass: "text-chart-5",
    },
    {
      label: "Savings rate",
      value: formatPercent(totals.savingsRate),
      description: `${totals.transactionCount} transactions currently shape this snapshot.`,
      icon: TrendingUp,
      toneClass: "text-chart-3",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.label}
            className="group relative overflow-hidden border border-border/70 bg-card/92 shadow-[0_18px_50px_rgba(74,62,38,0.08)] backdrop-blur transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${summaryAccentClasses[index]}`}
            />
            <CardContent className="relative p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-3 font-heading text-3xl tracking-tight text-foreground">
                    {item.value}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/85 p-3 shadow-sm">
                  <Icon className={`size-5 ${item.toneClass}`} />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Scale className="size-4 text-foreground/65" />
                <span>{item.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
