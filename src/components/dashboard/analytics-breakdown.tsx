"use client";

import { BarChart3, CalendarRange, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

import type { MonthlyBalanceDatum } from "@/lib/finance-analytics";
import type { CurrencyCode } from "@/lib/finance-types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/finance-format";

interface AnalyticsBreakdownProps {
  monthlySeries: MonthlyBalanceDatum[];
  currency: CurrencyCode;
  currencyLocale: string;
  exchangeRate: number;
}

export function AnalyticsBreakdown({
  monthlySeries,
  currency,
  currencyLocale,
  exchangeRate,
}: AnalyticsBreakdownProps) {
  const latestMonth = monthlySeries[monthlySeries.length - 1];
  const previousMonth = monthlySeries[monthlySeries.length - 2];
  const change = latestMonth && previousMonth ? latestMonth.net - previousMonth.net : 0;
  const savingsRatio =
    latestMonth && latestMonth.income > 0
      ? latestMonth.net / latestMonth.income
      : 0;

  const items = [
    {
      label: "Current month net",
      value: latestMonth
        ? formatCurrency(latestMonth.net * exchangeRate, {
            currency,
            locale: currencyLocale,
          })
        : "N/A",
      detail: latestMonth?.monthLabel ?? "No month available",
      icon: BarChart3,
    },
    {
      label: "Month over month",
      value:
        latestMonth && previousMonth
          ? `${change >= 0 ? "+" : "-"}${formatCurrency(Math.abs(change) * exchangeRate, {
              currency,
              locale: currencyLocale,
            })}`
          : "N/A",
      detail:
        latestMonth && previousMonth
          ? `${previousMonth.monthLabel} to ${latestMonth.monthLabel}`
          : "Need at least two months",
      icon: change >= 0 ? TrendingUp : TrendingDown,
    },
    {
      label: "Latest savings ratio",
      value: latestMonth ? formatPercent(savingsRatio, true) : "N/A",
      detail: "Net income remaining after latest month expenses",
      icon: PiggyBank,
    },
    {
      label: "Tracked months",
      value: String(monthlySeries.length),
      detail: "Monthly snapshots available for analysis",
      icon: CalendarRange,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.label}
            className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-3 font-heading text-3xl text-foreground">
                    {item.value}
                  </p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-background/78 text-primary">
                  <Icon className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
