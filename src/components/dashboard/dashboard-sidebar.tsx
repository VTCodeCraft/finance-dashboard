"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  ChartColumnBig,
  CreditCard,
  Landmark,
  LayoutDashboard,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { formatCurrency } from "@/lib/finance-format";
import type { FinancialTotals } from "@/lib/finance-analytics";
import type { CurrencyCode, UserRole } from "@/lib/finance-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  role: UserRole;
  currency: CurrencyCode;
  currencyLocale: string;
  balance: number;
  transactionCount: number;
  hasHydrated: boolean;
  totals: FinancialTotals;
}

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Finance", icon: Landmark, href: "/finance" },
  { label: "Transactions", icon: ReceiptText, href: "/transactions" },
  { label: "Analytics", icon: ChartColumnBig, href: "/analytics" },
  { label: "Wallet", icon: Wallet, href: "/wallet" },
];

export function DashboardSidebar({
  role,
  currency,
  currencyLocale,
  balance,
  transactionCount,
  hasHydrated,
  totals,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="space-y-4">
      <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
        <CardContent className="space-y-5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Landmark className="size-5" />
            </div>
            <div>
              <p className="font-heading text-xl text-foreground">Finora</p>
              <p className="text-sm text-muted-foreground">
                Personal finance workspace
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/72 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.label}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="mb-1 h-10 w-full justify-start rounded-xl"
                >
                  <Link href={item.href}>
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-border/70 bg-background/78 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Portfolio
              </p>
              <p className="mt-3 font-heading text-3xl text-foreground">
                {formatCurrency(balance, {
                  compact: true,
                  currency,
                  locale: currencyLocale,
                })}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {transactionCount} tracked entries across your current workspace.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/78 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Access
              </p>
              <div className="mt-3 flex items-center gap-2 text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span className="font-medium capitalize">{role}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {role === "admin"
                  ? "Editing controls are enabled."
                  : "Workspace is currently read only."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Workspace pulse</p>
            <BellRing className="size-4 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-background/72 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Income vs spend
              </p>
              <p className="mt-2 text-lg font-medium text-foreground">
                {Math.round((totals.expenses / Math.max(totals.income, 1)) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">
                of tracked income has already been spent.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/72 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Sync status
              </p>
              <p className="mt-2 text-lg font-medium text-foreground">
                {hasHydrated ? "Ready" : "Loading"}
              </p>
              <p className="text-sm text-muted-foreground">
                Local browser persistence {hasHydrated ? "is active." : "is hydrating."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/72 p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <CreditCard className="size-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">Jessica Alba</p>
                <p className="text-sm text-muted-foreground">
                  jessica.alba@email.com
                </p>
              </div>
            </div>
            <Button variant="ghost" className="mt-3 h-9 w-full justify-start rounded-xl">
              <Settings2 className="size-4" />
              Workspace settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
