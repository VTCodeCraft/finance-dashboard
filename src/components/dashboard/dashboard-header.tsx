"use client";

import {
  Check,
  ChevronDown,
  Eye,
  MoonStar,
  ShieldCheck,
  SunMedium,
  WalletCards,
} from "lucide-react";

import { formatCurrency, formatShortDate } from "@/lib/finance-format";
import type { CurrencyCode, ThemeMode, UserRole } from "@/lib/finance-types";
import { Button } from "@/components/ui/button";
import type { CurrencyOption } from "@/lib/currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  role: UserRole;
  theme: ThemeMode;
  currency: CurrencyCode;
  currencyOptions: CurrencyOption[];
  currencyLocale: string;
  exchangeRate: number;
  exchangeRateDate: string | null;
  rateStatusLabel: string;
  balance: number;
  onRoleChange: (role: UserRole) => void;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onToggleTheme: () => void;
}

export function DashboardHeader({
  role,
  theme,
  currency,
  currencyOptions,
  currencyLocale,
  exchangeRate,
  exchangeRateDate,
  rateStatusLabel,
  balance,
  onRoleChange,
  onCurrencyChange,
  onToggleTheme,
}: DashboardHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border/70 bg-card/95 px-6 py-6 shadow-[0_24px_80px_rgba(74,62,38,0.14)] backdrop-blur xl:px-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-3/10" />
      <div className="absolute -right-20 top-0 h-52 w-52 rounded-full bg-chart-3/20 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            <WalletCards className="size-3.5 text-primary" />
            Personal finance
          </div>

          <div className="space-y-3">
            <h1 className="max-w-2xl font-heading text-4xl leading-tight text-foreground sm:text-5xl">
              Track every move. See the story behind your money.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Review cash flow, monitor category pressure, and switch between
              viewer and admin roles to explore the full dashboard behavior.
            </p>
          </div>
        </div>

        <div className="lg:w-[320px]">
          <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Display currency
            </p>
            <p className="mt-3 font-heading text-3xl text-foreground">
              {formatCurrency(balance * exchangeRate, {
                compact: true,
                currency,
                locale: currencyLocale,
              })}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {rateStatusLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col gap-4 rounded-[28px] border border-border/70 bg-background/78 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Role access</p>
          <p className="text-sm text-muted-foreground">
            Viewers can browse insights. Admins can add and delete transactions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-full px-4"
              >
                Currency
                <span className="max-w-[170px] truncate">
                  {
                    currencyOptions.find((option) => option.code === currency)?.country
                  }{" "}
                  ({currency})
                </span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 rounded-2xl border border-border bg-popover/98 p-1.5 backdrop-blur"
              align="start"
            >
              {currencyOptions.map((option) => {
                const isSelected = option.code === currency;

                return (
                  <DropdownMenuItem
                    key={option.code}
                    className="rounded-xl px-3 py-2"
                    onSelect={() => onCurrencyChange(option.code as CurrencyCode)}
                  >
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {option.country}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {option.label} ({option.code})
                        </p>
                      </div>
                      {isSelected ? (
                        <Check className="size-4 shrink-0 text-primary" />
                      ) : null}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="inline-flex rounded-full border border-border bg-muted/70 p-1">
            <Button
              variant={role === "viewer" ? "default" : "ghost"}
              size="sm"
              className="h-8 rounded-full px-4"
              onClick={() => onRoleChange("viewer")}
            >
              <Eye className="size-4" />
              Viewer
            </Button>
            <Button
              variant={role === "admin" ? "default" : "ghost"}
              size="sm"
              className="h-8 rounded-full px-4"
              onClick={() => onRoleChange("admin")}
            >
              <ShieldCheck className="size-4" />
              Admin
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-full px-4"
            onClick={onToggleTheme}
          >
            {theme === "dark" ? (
              <SunMedium className="size-4" />
            ) : (
              <MoonStar className="size-4" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </div>

      <div className="relative mt-3 text-xs text-muted-foreground">
        {currency === "USD"
          ? "Base currency is USD. Other currency selections use the latest available daily market reference rate."
          : `1 USD = ${formatCurrency(exchangeRate, {
              currency,
              locale: currencyLocale,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} on ${
              exchangeRateDate
                ? formatShortDate(exchangeRateDate)
                : "the latest available date"
            }.`}
      </div>
    </section>
  );
}
