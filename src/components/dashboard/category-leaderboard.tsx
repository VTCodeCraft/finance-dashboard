"use client";

import { BadgeAlert, CircleDollarSign, TrendingUp } from "lucide-react";

import type { ExpenseCategoryDatum } from "@/lib/finance-analytics";
import type { CurrencyCode } from "@/lib/finance-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/finance-format";

interface CategoryLeaderboardProps {
  expenseBreakdown: ExpenseCategoryDatum[];
  currency: CurrencyCode;
  currencyLocale: string;
  exchangeRate: number;
}

export function CategoryLeaderboard({
  expenseBreakdown,
  currency,
  currencyLocale,
  exchangeRate,
}: CategoryLeaderboardProps) {
  return (
    <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
      <CardHeader>
        <CardTitle>Category leaderboard</CardTitle>
        <CardDescription>
          The biggest expense categories ranked by total outflow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {expenseBreakdown.slice(0, 5).map((entry, index) => (
          <div
            key={entry.category}
            className="rounded-2xl border border-border/70 bg-background/72 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  {index === 0 ? (
                    <BadgeAlert className="size-4" />
                  ) : index === 1 ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <CircleDollarSign className="size-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{entry.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercent(entry.share)} of total expenses
                  </p>
                </div>
              </div>
              <p className="font-medium text-foreground">
                {formatCurrency(entry.value * exchangeRate, {
                  currency,
                  locale: currencyLocale,
                })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
