import type { Currency, Transaction } from "@/lib/types/database";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? "−" : amount > 0 ? "+" : "";
  return `${sign}${symbol}${formatted}`;
}

export function formatCurrencyPlain(amount: number, currency: Currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export interface PeriodFilter {
  start: string;
  end: string;
  label: string;
}

export function getPeriodFilters(): PeriodFilter[] {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  return [
    {
      label: "This month",
      start: thisMonthStart.toISOString().slice(0, 10),
      end: now.toISOString().slice(0, 10),
    },
    {
      label: "Last month",
      start: lastMonthStart.toISOString().slice(0, 10),
      end: lastMonthEnd.toISOString().slice(0, 10),
    },
    {
      label: "All time",
      start: "1970-01-01",
      end: now.toISOString().slice(0, 10),
    },
  ];
}

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  start: string,
  end: string
): Transaction[] {
  return transactions.filter((t) => t.date >= start && t.date <= end);
}

export interface FinancialSummary {
  totalIncome: number;
  totalOutflows: number;
  surplus: number;
  byCategory: { category: string; amount: number; percentage: number }[];
  transactionCount: number;
}

export function computeSummary(transactions: Transaction[]): FinancialSummary {
  const income = transactions.filter((t) => t.is_income);
  const expenses = transactions.filter((t) => !t.is_income);

  const totalIncome = income.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  const totalOutflows = expenses.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const categoryMap = new Map<string, number>();
  for (const t of expenses) {
    const current = categoryMap.get(t.category) ?? 0;
    categoryMap.set(t.category, current + Math.abs(Number(t.amount)));
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalOutflows > 0 ? (amount / totalOutflows) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    totalIncome,
    totalOutflows,
    surplus: totalIncome - totalOutflows,
    byCategory,
    transactionCount: transactions.length,
  };
}

export function detectRecurring(transactions: Transaction[]): string[] {
  const descCounts = new Map<string, number>();
  for (const t of transactions) {
    if (t.is_income) continue;
    const key = t.description.toLowerCase().slice(0, 30);
    descCounts.set(key, (descCounts.get(key) ?? 0) + 1);
  }
  return Array.from(descCounts.entries())
    .filter(([, count]) => count >= 2)
    .map(([desc]) => desc)
    .slice(0, 5);
}
