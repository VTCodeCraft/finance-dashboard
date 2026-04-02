import { formatCurrency, formatMonthLabel, formatPercent } from "@/lib/finance-format";
import type { FinanceFilters, SortDirection, Transaction } from "@/lib/finance-types";

export interface FinancialTotals {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
  transactionCount: number;
}

export interface ExpenseCategoryDatum {
  category: string;
  value: number;
  share: number;
}

export interface MonthlyBalanceDatum {
  monthKey: string;
  monthLabel: string;
  income: number;
  expenses: number;
  net: number;
  balance: number;
}

export interface InsightCardData {
  id: string;
  title: string;
  headline: string;
  detail: string;
  tone: "positive" | "caution" | "neutral";
}

interface InsightFormatting {
  formatMoney?: (value: number) => string;
}

function sortByDate(transactions: Transaction[], direction: SortDirection) {
  return [...transactions].sort((left, right) => {
    const result = left.date.localeCompare(right.date);
    return direction === "asc" ? result : -result;
  });
}

export function getAvailableCategories(transactions: Transaction[]) {
  return [...new Set(transactions.map((transaction) => transaction.category))].sort(
    (left, right) => left.localeCompare(right)
  );
}

export function getFinancialTotals(transactions: Transaction[]): FinancialTotals {
  const totals = transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === "income") {
        accumulator.income += transaction.amount;
      } else {
        accumulator.expenses += transaction.amount;
      }

      return accumulator;
    },
    {
      income: 0,
      expenses: 0,
    }
  );

  const balance = totals.income - totals.expenses;
  const savingsRate = totals.income === 0 ? 0 : balance / totals.income;

  return {
    balance,
    income: totals.income,
    expenses: totals.expenses,
    savingsRate,
    transactionCount: transactions.length,
  };
}

export function getExpenseBreakdown(transactions: Transaction[]): ExpenseCategoryDatum[] {
  const expenses = transactions.filter((transaction) => transaction.type === "expense");
  const totalExpenses = expenses.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  if (totalExpenses === 0) {
    return [];
  }

  const grouped = expenses.reduce((accumulator, transaction) => {
    accumulator.set(
      transaction.category,
      (accumulator.get(transaction.category) ?? 0) + transaction.amount
    );
    return accumulator;
  }, new Map<string, number>());

  return [...grouped.entries()]
    .map(([category, value]) => ({
      category,
      value,
      share: value / totalExpenses,
    }))
    .sort((left, right) => right.value - left.value);
}

export function getMonthlyBalanceSeries(transactions: Transaction[]): MonthlyBalanceDatum[] {
  const grouped = sortByDate(transactions, "asc").reduce((accumulator, transaction) => {
    const monthKey = transaction.date.slice(0, 7);
    const existing = accumulator.get(monthKey) ?? {
      monthKey,
      monthLabel: formatMonthLabel(monthKey),
      income: 0,
      expenses: 0,
      net: 0,
      balance: 0,
    };

    if (transaction.type === "income") {
      existing.income += transaction.amount;
    } else {
      existing.expenses += transaction.amount;
    }

    accumulator.set(monthKey, existing);
    return accumulator;
  }, new Map<string, MonthlyBalanceDatum>());

  let runningBalance = 0;

  return [...grouped.values()].map((entry) => {
    const net = entry.income - entry.expenses;
    runningBalance += net;

    return {
      ...entry,
      net,
      balance: runningBalance,
    };
  });
}

export function getFilteredTransactions(
  transactions: Transaction[],
  filters: FinanceFilters
) {
  const searchQuery = filters.search.trim().toLowerCase();

  const filtered = transactions.filter((transaction) => {
    const matchesSearch =
      searchQuery.length === 0 ||
      transaction.description.toLowerCase().includes(searchQuery) ||
      transaction.category.toLowerCase().includes(searchQuery) ||
      transaction.type.toLowerCase().includes(searchQuery);

    const matchesType =
      filters.type === "all" || transaction.type === filters.type;

    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;

    return matchesSearch && matchesType && matchesCategory;
  });

  return filtered.sort((left, right) => {
    const direction = filters.sortDirection === "asc" ? 1 : -1;

    if (filters.sortBy === "amount") {
      return (left.amount - right.amount) * direction;
    }

    return left.date.localeCompare(right.date) * direction;
  });
}

function buildTopCategoryInsight(
  transactions: Transaction[],
  formatMoney: (value: number) => string
): InsightCardData {
  const breakdown = getExpenseBreakdown(transactions);
  const topCategory = breakdown[0];

  if (!topCategory) {
    return {
      id: "top-category",
      title: "Top spending category",
      headline: "No expense activity yet",
      detail: "Add expenses to reveal where most of your budget is going.",
      tone: "neutral",
    };
  }

  return {
    id: "top-category",
    title: "Top spending category",
    headline: `${topCategory.category} leads your spending`,
    detail: `${topCategory.category} accounts for ${formatPercent(
      topCategory.share
    )} of tracked expenses at ${formatMoney(topCategory.value)}.`,
    tone: "caution",
  };
}

function buildMonthlyComparisonInsight(
  transactions: Transaction[],
  formatMoney: (value: number) => string
): InsightCardData {
  const monthlySeries = getMonthlyBalanceSeries(transactions).filter(
    (entry) => entry.income > 0 || entry.expenses > 0
  );

  if (monthlySeries.length < 2) {
    return {
      id: "monthly-comparison",
      title: "Monthly comparison",
      headline: "More history needed",
      detail: "Track activity across at least two months to unlock comparisons.",
      tone: "neutral",
    };
  }

  const currentMonth = monthlySeries[monthlySeries.length - 1];
  const previousMonth = monthlySeries[monthlySeries.length - 2];
  const difference = currentMonth.expenses - previousMonth.expenses;
  const changeRatio =
    previousMonth.expenses === 0 ? 0 : difference / previousMonth.expenses;

  if (difference === 0) {
    return {
      id: "monthly-comparison",
      title: "Monthly comparison",
      headline: `Expenses held steady in ${currentMonth.monthLabel}`,
      detail: `You spent ${formatMoney(
        currentMonth.expenses
      )} in both ${previousMonth.monthLabel} and ${currentMonth.monthLabel}.`,
      tone: "positive",
    };
  }

  const direction = difference > 0 ? "more" : "less";
  const tone = difference > 0 ? "caution" : "positive";

  return {
    id: "monthly-comparison",
    title: "Monthly comparison",
    headline: `You spent ${formatPercent(Math.abs(changeRatio))} ${direction} this month`,
    detail: `${currentMonth.monthLabel} closed at ${formatMoney(
      currentMonth.expenses
    )} versus ${formatMoney(previousMonth.expenses)} in ${
      previousMonth.monthLabel
    }.`,
    tone,
  };
}

function buildLargestExpenseInsight(
  transactions: Transaction[],
  formatMoney: (value: number) => string
): InsightCardData {
  const expenses = sortByDate(
    transactions.filter((transaction) => transaction.type === "expense"),
    "desc"
  );

  if (expenses.length === 0) {
    return {
      id: "largest-expense",
      title: "Largest recent expense",
      headline: "Nothing to flag yet",
      detail: "Once expenses are recorded, the largest recent spend will appear here.",
      tone: "neutral",
    };
  }

  const newestDate = new Date(`${expenses[0].date}T00:00:00`);
  const cutoff = new Date(newestDate);
  cutoff.setDate(cutoff.getDate() - 45);

  const recentExpenses = expenses.filter(
    (transaction) => new Date(`${transaction.date}T00:00:00`) >= cutoff
  );
  const comparisonPool = recentExpenses.length > 0 ? recentExpenses : expenses;

  const largestExpense = comparisonPool.reduce((largest, transaction) =>
    transaction.amount > largest.amount ? transaction : largest
  );

  return {
    id: "largest-expense",
    title: "Largest recent expense",
    headline: `${formatMoney(largestExpense.amount)} went to ${largestExpense.category}`,
    detail: `${largestExpense.description} is the biggest recent outflow, making it a good candidate to review for future savings.`,
    tone: "neutral",
  };
}

export function getInsightCards(
  transactions: Transaction[],
  options: InsightFormatting = {}
): InsightCardData[] {
  const formatMoney = options.formatMoney ?? ((value: number) => formatCurrency(value));

  return [
    buildTopCategoryInsight(transactions, formatMoney),
    buildMonthlyComparisonInsight(transactions, formatMoney),
    buildLargestExpenseInsight(transactions, formatMoney),
  ];
}
