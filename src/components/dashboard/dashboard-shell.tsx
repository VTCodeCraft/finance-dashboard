"use client";

import { motion } from "framer-motion";

import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardSpotlight } from "@/components/dashboard/dashboard-spotlight";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TransactionsSection } from "@/components/dashboard/transactions-section";
import { useDashboardWorkspace } from "@/components/dashboard/use-dashboard-workspace";
import { WalletOverview } from "@/components/dashboard/wallet-overview";
import { supportedCurrencies } from "@/lib/currency";

type DashboardPage = "overview" | "finance" | "transactions" | "analytics" | "wallet";

interface DashboardShellProps {
  page: DashboardPage;
}

function PageSectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-heading text-3xl text-foreground">{title}</h2>
      </div>
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function DashboardShell({ page }: DashboardShellProps) {
  const workspace = useDashboardWorkspace();

  const {
    addTransaction,
    categories,
    clearFilters,
    currency,
    currencyOption,
    deleteTransaction,
    exchangeRate,
    expenseBreakdown,
    filteredTransactions,
    filters,
    hasHydrated,
    insights,
    monthlySeries,
    rateState,
    rateStatusLabel,
    resetDemoData,
    role,
    setCategoryFilter,
    setCurrency,
    setRole,
    setSearch,
    setSort,
    setTypeFilter,
    theme,
    toggleTheme,
    totals,
    transactions,
  } = {
    ...workspace,
  };

  const header = (
    <DashboardHeader
      role={role}
      theme={theme}
      currency={currency}
      currencyOptions={supportedCurrencies}
      currencyLocale={currencyOption.locale}
      exchangeRate={exchangeRate}
      exchangeRateDate={rateState.date}
      rateStatusLabel={rateStatusLabel}
      transactionCount={totals.transactionCount}
      balance={totals.balance}
      hasHydrated={hasHydrated}
      onRoleChange={setRole}
      onCurrencyChange={setCurrency}
      onToggleTheme={toggleTheme}
    />
  );

  const sidebar = (
    <DashboardSidebar
      role={role}
      currency={currency}
      currencyLocale={currencyOption.locale}
      balance={totals.balance * exchangeRate}
      transactionCount={totals.transactionCount}
      hasHydrated={hasHydrated}
      totals={totals}
    />
  );

  const summaryCards = (
    <SummaryCards
      totals={totals}
      currency={currency}
      currencyLocale={currencyOption.locale}
      exchangeRate={exchangeRate}
    />
  );

  const charts = (
    <DashboardCharts
      monthlySeries={monthlySeries}
      expenseBreakdown={expenseBreakdown}
      currency={currency}
      currencyLocale={currencyOption.locale}
      exchangeRate={exchangeRate}
    />
  );

  const spotlight = (
    <DashboardSpotlight
      currency={currency}
      currencyLocale={currencyOption.locale}
      exchangeRate={exchangeRate}
      expenseBreakdown={expenseBreakdown}
      monthlySeries={monthlySeries}
    />
  );

  const transactionsSection = (
    <TransactionsSection
      transactions={transactions}
      filteredTransactions={filteredTransactions}
      categories={categories}
      role={role}
      currency={currency}
      filters={filters}
      exchangeRate={exchangeRate}
      onAddTransaction={addTransaction}
      onDeleteTransaction={deleteTransaction}
      onResetDemoData={resetDemoData}
      onSearchChange={setSearch}
      onTypeFilterChange={setTypeFilter}
      onCategoryFilterChange={setCategoryFilter}
      onSortChange={setSort}
      onClearFilters={clearFilters}
    />
  );

  const pageBody =
    page === "overview" ? (
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="space-y-4">
            <PageSectionHeader
              eyebrow="Overview"
              title="Portfolio overview"
              description="A higher-level snapshot of your workspace with the most important financial signals first."
            />
            {summaryCards}
          </section>
          <section className="space-y-4">
            <PageSectionHeader
              eyebrow="Highlights"
              title="Finance command view"
              description="Key signals pulled apart into distinct modules so the page feels less stacked and easier to scan."
            />
            {charts}
          </section>
        </div>
        <div className="space-y-6">
          {spotlight}
          <InsightsPanel insights={insights} compact />
        </div>
      </div>
    ) : page === "finance" ? (
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="space-y-4">
            <PageSectionHeader
              eyebrow="Finance"
              title="Core finance dashboard"
              description="The main finance view combines totals, trend movement, and expense allocation into one focused workspace."
            />
            {summaryCards}
          </section>
          <section className="space-y-4">{charts}</section>
        </div>
        <div className="space-y-6">
          {spotlight}
          <InsightsPanel insights={insights} compact />
        </div>
      </div>
    ) : page === "transactions" ? (
      <div className="space-y-6">
        <section className="space-y-4">
          <PageSectionHeader
            eyebrow="Transactions"
            title="Dedicated activity ledger"
            description="All transaction management now lives on its own route, with separate space for searching, sorting, and admin actions."
          />
          {summaryCards}
        </section>
        {transactionsSection}
      </div>
    ) : page === "analytics" ? (
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="space-y-4">
            <PageSectionHeader
              eyebrow="Analytics"
              title="Deep-dive performance"
              description="A dedicated analytics route for trends, allocation, and interpretive insights instead of squeezing them into the main page."
            />
            {charts}
          </section>
          <InsightsPanel insights={insights} />
        </div>
        <div className="space-y-6">{spotlight}</div>
      </div>
    ) : (
      <div className="space-y-6">
        <WalletOverview
          currency={currency}
          currencyLocale={currencyOption.locale}
          exchangeRate={exchangeRate}
          exchangeRateDate={rateState.date}
          role={role}
          totals={totals}
        />
        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>{summaryCards}</div>
          <div>{spotlight}</div>
        </div>
      </div>
    );

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,154,163,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(210,156,83,0.15),transparent_28%)]" />

      <main className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-6 xl:self-start">{sidebar}</div>

          <div className="space-y-6">
            {header}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {pageBody}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
