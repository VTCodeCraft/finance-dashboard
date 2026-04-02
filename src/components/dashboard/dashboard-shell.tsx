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

type DashboardPage =
  | "overview"
  | "finance"
  | "transactions"
  | "analytics"
  | "wallet";

interface DashboardShellProps {
  page: DashboardPage;
}

const sectionMotion = {
  initial: { opacity: 0, y: 18, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

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

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={sectionMotion.initial}
      animate={sectionMotion.animate}
      transition={sectionMotion.transition}
      className={className}
    >
      {children}
    </motion.section>
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
  } = workspace;

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

  const overviewBody = (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <AnimatedSection className="space-y-4">
          <PageSectionHeader
            eyebrow="Overview"
            title="Portfolio overview"
            description="A higher-level snapshot of your workspace with the most important financial signals first."
          />
          {summaryCards}
        </AnimatedSection>

        <AnimatedSection className="space-y-4">
          <PageSectionHeader
            eyebrow="Highlights"
            title="Finance command view"
            description="Key signals pulled apart into distinct modules so the page feels less stacked and easier to scan."
          />
          {charts}
        </AnimatedSection>
      </div>

      <div className="space-y-6">
        <AnimatedSection>{spotlight}</AnimatedSection>
        <AnimatedSection>
          <InsightsPanel insights={insights} compact />
        </AnimatedSection>
      </div>
    </div>
  );

  const financeBody = (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <AnimatedSection className="space-y-4">
          <PageSectionHeader
            eyebrow="Finance"
            title="Core finance dashboard"
            description="The main finance view combines totals, trend movement, and expense allocation into one focused workspace."
          />
          {summaryCards}
        </AnimatedSection>

        <AnimatedSection className="space-y-4">{charts}</AnimatedSection>
      </div>

      <div className="space-y-6">
        <AnimatedSection>{spotlight}</AnimatedSection>
        <AnimatedSection>
          <InsightsPanel insights={insights} compact />
        </AnimatedSection>
      </div>
    </div>
  );

  const transactionsBody = (
    <div className="space-y-6">
      <AnimatedSection className="space-y-4">
        <PageSectionHeader
          eyebrow="Transactions"
          title="Dedicated activity ledger"
          description="All transaction management now lives on its own route, with separate space for searching, sorting, and admin actions."
        />
        {summaryCards}
      </AnimatedSection>

      <AnimatedSection>{transactionsSection}</AnimatedSection>
    </div>
  );

  const analyticsBody = (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <AnimatedSection className="space-y-4">
          <PageSectionHeader
            eyebrow="Analytics"
            title="Deep-dive performance"
            description="A dedicated analytics route for trends, allocation, and interpretive insights instead of squeezing them into the main page."
          />
          {charts}
        </AnimatedSection>

        <AnimatedSection>
          <InsightsPanel insights={insights} />
        </AnimatedSection>
      </div>

      <div className="space-y-6">
        <AnimatedSection>{spotlight}</AnimatedSection>
      </div>
    </div>
  );

  const walletBody = (
    <div className="space-y-6">
      <AnimatedSection>
        <WalletOverview
          currency={currency}
          currencyLocale={currencyOption.locale}
          exchangeRate={exchangeRate}
          exchangeRateDate={rateState.date}
          role={role}
          totals={totals}
        />
      </AnimatedSection>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <AnimatedSection>{summaryCards}</AnimatedSection>
        <AnimatedSection>{spotlight}</AnimatedSection>
      </div>
    </div>
  );

  const pageBody =
    page === "overview"
      ? overviewBody
      : page === "finance"
        ? financeBody
        : page === "transactions"
          ? transactionsBody
          : page === "analytics"
            ? analyticsBody
            : walletBody;

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,154,163,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(210,156,83,0.15),transparent_28%)]" />

      <main className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <motion.div
            initial={sectionMotion.initial}
            animate={sectionMotion.animate}
            transition={sectionMotion.transition}
            className="xl:sticky xl:top-6 xl:self-start"
          >
            {sidebar}
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={sectionMotion.initial}
              animate={sectionMotion.animate}
              transition={sectionMotion.transition}
            >
              {header}
            </motion.div>

            {pageBody}
          </div>
        </div>
      </main>
    </div>
  );
}
