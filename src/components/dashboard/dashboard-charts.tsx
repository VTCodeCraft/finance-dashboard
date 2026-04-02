"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ExpenseCategoryDatum,
  MonthlyBalanceDatum,
} from "@/lib/finance-analytics";
import { convertFromUsd } from "@/lib/currency";
import { formatCurrency, formatPercent } from "@/lib/finance-format";
import type { CurrencyCode } from "@/lib/finance-types";

interface DashboardChartsProps {
  monthlySeries: MonthlyBalanceDatum[];
  expenseBreakdown: ExpenseCategoryDatum[];
  currency: CurrencyCode;
  currencyLocale: string;
  exchangeRate: number;
}

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function formatTooltipCurrency(
  value: number | string | readonly (number | string)[] | undefined,
  currency: CurrencyCode,
  locale: string
) {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  return [
    formatCurrency(Number(normalizedValue ?? 0), {
      currency,
      locale,
    }),
    "Value",
  ] as const;
}

function EmptyChartState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center rounded-[22px] border border-dashed border-border bg-muted/35 px-6 text-center">
      <p className="font-heading text-xl text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function DashboardCharts({
  monthlySeries,
  expenseBreakdown,
  currency,
  currencyLocale,
  exchangeRate,
}: DashboardChartsProps) {
  const totalExpenses = expenseBreakdown.reduce(
    (sum, category) => sum + category.value,
    0
  );
  const convertedMonthlySeries = monthlySeries.map((entry) => ({
    ...entry,
    balance: convertFromUsd(entry.balance, exchangeRate),
  }));
  const convertedExpenseBreakdown = expenseBreakdown.map((entry) => ({
    ...entry,
    value: convertFromUsd(entry.value, exchangeRate),
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
      <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
        <CardHeader>
          <CardTitle>Balance trend</CardTitle>
          <CardDescription>
            Monthly running balance built from your full transaction history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthlySeries.length === 0 ? (
            <EmptyChartState
              title="No balance history yet"
              description="Add transactions to start tracing your balance trend over time."
            />
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={convertedMonthlySeries}
                  margin={{ top: 8, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="monthLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    tickFormatter={(value) =>
                      formatCurrency(Number(value), {
                        compact: true,
                        currency,
                        locale: currencyLocale,
                      })
                    }
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--color-chart-1)", strokeDasharray: "4 4" }}
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      boxShadow: "0 18px 40px rgba(30, 20, 8, 0.12)",
                    }}
                    formatter={(value) => {
                      const [formatted] = formatTooltipCurrency(
                        value,
                        currency,
                        currencyLocale
                      );
                      return [formatted, "Balance"] as const;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="var(--color-chart-1)"
                    strokeWidth={3}
                    fill="url(#balanceFill)"
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-border/70 bg-card/92 shadow-[0_18px_54px_rgba(74,62,38,0.08)] backdrop-blur">
        <CardHeader>
          <CardTitle>Expense mix</CardTitle>
          <CardDescription>
            Category breakdown of all recorded expenses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {expenseBreakdown.length === 0 ? (
            <EmptyChartState
              title="No expense categories to chart"
              description="As soon as you record an expense, this donut will show how your spend is distributed."
            />
          ) : (
            <>
              <div className="relative h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={convertedExpenseBreakdown}
                      dataKey="value"
                      nameKey="category"
                      innerRadius={78}
                      outerRadius={108}
                      paddingAngle={4}
                      strokeWidth={0}
                    >
                      {convertedExpenseBreakdown.map((entry, index) => (
                        <Cell
                          key={entry.category}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid var(--color-border)",
                        background: "var(--color-card)",
                        boxShadow: "0 18px 40px rgba(30, 20, 8, 0.12)",
                      }}
                      formatter={(value) => {
                        const [formatted] = formatTooltipCurrency(
                          value,
                          currency,
                          currencyLocale
                        );
                        return [formatted, "Spend"] as const;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Total spend
                  </p>
                  <p className="mt-2 font-heading text-3xl text-foreground">
                    {formatCurrency(convertFromUsd(totalExpenses, exchangeRate), {
                      compact: true,
                      currency,
                      locale: currencyLocale,
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {convertedExpenseBreakdown.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.category}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/70 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="size-3 rounded-full"
                        style={{
                          backgroundColor: chartColors[index % chartColors.length],
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {entry.category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPercent(entry.share)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(entry.value, {
                        currency,
                        locale: currencyLocale,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
