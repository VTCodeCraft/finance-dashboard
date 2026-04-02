"use client";

import { startTransition, useState, useTransition } from "react";
import { ArrowDownUp, Eye, Filter, Plus, RotateCcw, Search, ShieldCheck, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  convertToUsd,
  getCurrencyOption,
} from "@/lib/currency";
import {
  formatShortDate,
  formatSignedCurrency,
  formatTransactionTypeLabel,
  getTodayDateInputValue,
} from "@/lib/finance-format";
import type {
  CurrencyCode,
  FinanceFilters,
  Transaction,
  TransactionDraft,
  TransactionSortBy,
  TransactionType,
  UserRole,
} from "@/lib/finance-types";

interface TransactionsSectionProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  categories: string[];
  role: UserRole;
  currency: CurrencyCode;
  filters: FinanceFilters;
  exchangeRate: number;
  onAddTransaction: (transaction: TransactionDraft) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onResetDemoData: () => void;
  onSearchChange: (search: string) => void;
  onTypeFilterChange: (type: FinanceFilters["type"]) => void;
  onCategoryFilterChange: (category: string) => void;
  onSortChange: (sortBy: TransactionSortBy) => void;
  onClearFilters: () => void;
}

const selectClassName =
  "h-10 rounded-xl border border-input bg-background/80 px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface TransactionFormState {
  date: string;
  description: string;
  amount: string;
  category: string;
  type: TransactionType;
}

const defaultFormState = (): TransactionFormState => ({
  date: getTodayDateInputValue(),
  description: "",
  amount: "",
  category: "",
  type: "expense",
});

function SortButton({
  label,
  sortBy,
  activeSort,
  direction,
  onSort,
}: {
  label: string;
  sortBy: TransactionSortBy;
  activeSort: TransactionSortBy;
  direction: FinanceFilters["sortDirection"];
  onSort: (sortBy: TransactionSortBy) => void;
}) {
  const isActive = activeSort === sortBy;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "h-auto px-0 py-0 font-medium transition-colors hover:bg-transparent",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
      onClick={() => onSort(sortBy)}
    >
      {label}
      <ArrowDownUp className="size-3.5" />
      {isActive ? (
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {direction}
        </span>
      ) : null}
    </Button>
  );
}

export function TransactionsSection({
  transactions,
  filteredTransactions,
  categories,
  role,
  currency,
  filters,
  exchangeRate,
  onAddTransaction,
  onDeleteTransaction,
  onResetDemoData,
  onSearchChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onSortChange,
  onClearFilters,
}: TransactionsSectionProps) {
  const currencyLocale = getCurrencyOption(currency).locale;
  const [formState, setFormState] = useState<TransactionFormState>(defaultFormState);
  const [isPending, startFormTransition] = useTransition();

  function updateForm<K extends keyof TransactionFormState>(
    key: K,
    value: TransactionFormState[K]
  ) {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const description = formState.description.trim();
    const category = formState.category.trim();
    const amount = Number(formState.amount);

    if (!description || !category || amount <= 0) {
      return;
    }

    startFormTransition(() => {
      onAddTransaction({
        date: formState.date,
        description,
        amount: convertToUsd(amount, exchangeRate),
        category,
        type: formState.type,
      });
      setFormState(defaultFormState());
    });
  }

  const hasTransactions = transactions.length > 0;
  const hasMatches = filteredTransactions.length > 0;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Transactions
          </p>
          <h2 className="mt-2 font-heading text-3xl text-foreground">
            Search, filter, and audit activity
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground">
          {role === "admin" ? (
            <>
              <ShieldCheck className="size-4 text-primary" />
              Admin mode is active. Add and delete controls are enabled.
            </>
          ) : (
            <>
              <Eye className="size-4 text-primary" />
              Viewer mode is active. Data is read-only.
            </>
          )}
        </div>
      </div>

      {role === "admin" ? (
        <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
          <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Add transaction</CardTitle>
              <CardDescription>
                Capture a new transaction and update the dashboard instantly.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onResetDemoData}>
              <RotateCcw className="size-4" />
              Reset demo data
            </Button>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3 lg:grid-cols-[1.05fr_1.3fr_0.9fr_1fr_0.9fr_auto]" onSubmit={handleSubmit}>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Date</span>
                <Input
                  type="date"
                  value={formState.date}
                  onChange={(event) => updateForm("date", event.target.value)}
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Description</span>
                <Input
                  type="text"
                  value={formState.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="Freelance invoice"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Amount ({currency})</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  placeholder="0.00"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Category</span>
                <Input
                  type="text"
                  list="transaction-categories"
                  value={formState.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                  placeholder="Housing"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Type</span>
                <select
                  className={selectClassName}
                  value={formState.type}
                  onChange={(event) =>
                    updateForm("type", event.target.value as TransactionType)
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>
              <div className="flex items-end">
                <Button className="h-10 w-full rounded-xl" disabled={isPending} type="submit">
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
            </form>

            <datalist id="transaction-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Activity ledger</CardTitle>
              <CardDescription>
                Search descriptions, narrow by category or type, and sort by date or amount.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <Filter className="size-4" />
              Clear filters
            </Button>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.7fr_0.8fr_0.9fr]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                className="h-10 rounded-xl bg-background/80 pl-10"
                placeholder="Search descriptions, category, or type"
                value={filters.search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </label>

            <select
              className={selectClassName}
              value={filters.type}
              onChange={(event) =>
                onTypeFilterChange(event.target.value as FinanceFilters["type"])
              }
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              className={selectClassName}
              value={filters.category}
              onChange={(event) => onCategoryFilterChange(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {!hasTransactions ? (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-muted/35 px-6 py-16 text-center">
              <p className="font-heading text-2xl text-foreground">
                No transactions available
              </p>
              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                This dashboard is ready, but it needs transactions to tell a story.
                Switch to admin mode to add your first entry or restore the sample dataset.
              </p>
              {role === "admin" ? (
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button onClick={onResetDemoData}>
                    <RotateCcw className="size-4" />
                    Restore demo data
                  </Button>
                </div>
              ) : null}
            </div>
          ) : !hasMatches ? (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-muted/35 px-6 py-16 text-center">
              <p className="font-heading text-2xl text-foreground">
                No matching transactions
              </p>
              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                Try clearing the current filters or search query to bring the activity list back into view.
              </p>
              <div className="mt-5">
                <Button variant="outline" onClick={onClearFilters}>
                  Reset filters
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton
                      label="Date"
                      sortBy="date"
                      activeSort={filters.sortBy}
                      direction={filters.sortDirection}
                      onSort={onSortChange}
                    />
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">
                    <SortButton
                      label="Amount"
                      sortBy="amount"
                      activeSort={filters.sortBy}
                      direction={filters.sortDirection}
                      onSort={onSortChange}
                    />
                  </TableHead>
                  {role === "admin" ? <TableHead className="text-right">Action</TableHead> : null}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatShortDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium text-foreground">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                          transaction.type === "income"
                            ? "bg-chart-2/14 text-chart-2"
                            : "bg-chart-5/14 text-chart-5"
                        )}
                      >
                        {formatTransactionTypeLabel(transaction.type)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transaction.type === "income" ? "text-chart-2" : "text-chart-5"
                      )}
                    >
                      {transaction.type === "income"
                        ? formatSignedCurrency(transaction.amount * exchangeRate, {
                            currency,
                            locale: currencyLocale,
                          })
                        : formatSignedCurrency(-(transaction.amount * exchangeRate), {
                            currency,
                            locale: currencyLocale,
                          })}
                    </TableCell>
                    {role === "admin" ? (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            startTransition(() => {
                              onDeleteTransaction(transaction.id);
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
