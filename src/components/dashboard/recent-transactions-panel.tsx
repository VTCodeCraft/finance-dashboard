"use client";

import { ArrowUpRight, Clock3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatShortDate, formatTransactionTypeLabel } from "@/lib/finance-format";
import type { CurrencyCode, Transaction } from "@/lib/finance-types";

interface RecentTransactionsPanelProps {
  transactions: Transaction[];
  currency: CurrencyCode;
  currencyLocale: string;
  exchangeRate: number;
}

export function RecentTransactionsPanel({
  transactions,
  currency,
  currencyLocale,
  exchangeRate,
}: RecentTransactionsPanelProps) {
  const recentTransactions = [...transactions]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 5);

  return (
    <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>
          A quick snapshot of the latest money movement across your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/72 p-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {transaction.description}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{formatShortDate(transaction.date)}</span>
                <span>•</span>
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{formatTransactionTypeLabel(transaction.type)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">
                {formatCurrency(transaction.amount * exchangeRate, {
                  currency,
                  locale: currencyLocale,
                })}
              </p>
              <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <Clock3 className="size-3" />
                Latest
              </div>
            </div>
          </div>
        ))}

        {recentTransactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/72 p-6 text-sm text-muted-foreground">
            No transactions yet. Add entries to start building activity history.
          </div>
        ) : null}

        <div className="flex items-center gap-2 pt-1 text-sm text-primary">
          <ArrowUpRight className="size-4" />
          Rolling view of the five latest entries
        </div>
      </CardContent>
    </Card>
  );
}
