"use client";

import { ArrowRight, ChartPie, Clock3, Sparkles, WalletCards } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/finance-format";
import type {
  ExpenseCategoryDatum,
  MonthlyBalanceDatum,
} from "@/lib/finance-analytics";
import type { CurrencyCode } from "@/lib/finance-types";

interface DashboardSpotlightProps {
  currency: CurrencyCode;
  currencyLocale: string;
  exchangeRate: number;
  expenseBreakdown: ExpenseCategoryDatum[];
  monthlySeries: MonthlyBalanceDatum[];
}

export function DashboardSpotlight({
  currency,
  currencyLocale,
  exchangeRate,
  expenseBreakdown,
  monthlySeries,
}: DashboardSpotlightProps) {
  const topCategory = expenseBreakdown[0];
  const latestMonth = monthlySeries[monthlySeries.length - 1];
  const previousMonth = monthlySeries[monthlySeries.length - 2];
  const monthDelta = latestMonth && previousMonth
    ? latestMonth.expenses - previousMonth.expenses
    : 0;

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Command center
        </p>
        <h2 className="mt-2 font-heading text-3xl text-foreground">
          Diversified at a glance
        </h2>
      </div>

      <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
        <CardHeader>
          <CardTitle>Focus areas</CardTitle>
          <CardDescription>
            A lightweight rail inspired by portfolio dashboards with room for quick scanning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground">
                <ChartPie className="size-4 text-primary" />
                <span className="font-medium">Top category</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 font-heading text-2xl text-foreground">
              {topCategory?.category ?? "No spend yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {topCategory
                ? formatCurrency(topCategory.value * exchangeRate, {
                    currency,
                    locale: currencyLocale,
                  })
                : "Track an expense to reveal the dominant category."}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <Clock3 className="size-4 text-chart-3" />
              <span className="font-medium">Monthly pace</span>
            </div>
            <p className="mt-3 font-heading text-2xl text-foreground">
              {latestMonth?.monthLabel ?? "Awaiting history"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {latestMonth && previousMonth
                ? `${monthDelta > 0 ? "Up" : "Down"} ${formatCurrency(
                    Math.abs(monthDelta) * exchangeRate,
                    {
                      currency,
                      locale: currencyLocale,
                    }
                  )} versus ${previousMonth.monthLabel}.`
                : "Once multiple months exist, this rail will compare pace automatically."}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/72 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <WalletCards className="size-4 text-chart-2" />
              <span className="font-medium">Layout note</span>
            </div>
            <p className="mt-3 font-heading text-2xl text-foreground">
              Workspace mode
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The page is now split into navigation, overview, analytics, and action zones instead of one continuous stack.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/18 bg-primary/7 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <Sparkles className="size-4 text-primary" />
              <span className="font-medium">Design direction</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              The structure now borrows from finance-product dashboards: a stable left rail, a center workspace for charts and tables, and a side rail for quick-glance insight cards.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
