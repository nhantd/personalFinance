import type { Currency, Transaction } from "@/lib/types/database";
import { SYSTEM_CATEGORIES } from "@/lib/types/database";
import { convertWithRates } from "@/lib/fx/exchange";

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  VND: "₫",
  JPY: "¥",
};

export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
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

export function resolveDisplayCurrency(
  transactions: Transaction[],
  profileDefault: Currency = "USD"
): { currency: Currency; isMixed: boolean } {
  if (transactions.length === 0) {
    return { currency: profileDefault, isMixed: false };
  }

  const counts = new Map<Currency, number>();
  for (const tx of transactions) {
    const c = tx.currency as Currency;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }

  if (counts.size === 1) {
    return { currency: [...counts.keys()][0], isMixed: false };
  }

  const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  return { currency: dominant ?? profileDefault, isMixed: true };
}

export interface PeriodFilter {
  start: string;
  end: string;
  label: string;
}

export interface MonthBucket {
  monthKey: string;
  label: string;
  start: string;
  end: string;
}

export function getMonthBucketsRolling(months: number): MonthBucket[] {
  const now = new Date();
  const buckets: MonthBucket[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push(monthBucketFromDate(d));
  }

  return buckets;
}

export function getMonthBucketsFromRange(start: string, end: string): MonthBucket[] {
  const rangeStart = new Date(`${start}T00:00:00`);
  const rangeEnd = new Date(`${end}T00:00:00`);
  const buckets: MonthBucket[] = [];

  let cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  const lastMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);

  while (cursor <= lastMonth) {
    buckets.push(monthBucketFromDate(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return buckets.length > 0 ? buckets : [monthBucketFromDate(rangeStart)];
}

function monthBucketFromDate(d: Date): MonthBucket {
  const year = d.getFullYear();
  const month = d.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const lastDay = new Date(year, month + 1, 0).getDate();

  return {
    monthKey,
    label: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    start: `${monthKey}-01`,
    end: `${monthKey}-${String(lastDay).padStart(2, "0")}`,
  };
}

export function getPeriodFilters(): PeriodFilter[] {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const ytdStart = new Date(now.getFullYear(), 0, 1);

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
      label: "YTD",
      start: ytdStart.toISOString().slice(0, 10),
      end: now.toISOString().slice(0, 10),
    },
    {
      label: "All time",
      start: "1970-01-01",
      end: now.toISOString().slice(0, 10),
    },
  ];
}

/** Index of "YTD" in getPeriodFilters() — app-wide default period. */
export const DEFAULT_PERIOD_PRESET_INDEX = 2;

export function getYtdMonthBuckets(): MonthBucket[] {
  const ytd = getPeriodFilters()[DEFAULT_PERIOD_PRESET_INDEX];
  return getMonthBucketsFromRange(ytd.start, ytd.end);
}

export function resolvePeriodFromParams(
  searchParams: { get: (key: string) => string | null },
  defaultPresetIndex = DEFAULT_PERIOD_PRESET_INDEX
): PeriodFilter {
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (from || to) {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    return {
      label: "Custom",
      start: from ?? "1970-01-01",
      end: to ?? today,
    };
  }

  const periods = getPeriodFilters();
  const rawPeriod = parseInt(searchParams.get("period") ?? String(defaultPresetIndex), 10);
  const periodIndex =
    Number.isFinite(rawPeriod) && rawPeriod >= 0 && rawPeriod < periods.length
      ? rawPeriod
      : defaultPresetIndex;
  return periods[periodIndex];
}

export function filterTransactionsByAccount(
  transactions: Transaction[],
  accountId: string | null
): Transaction[] {
  if (!accountId) return transactions;
  return transactions.filter((t) => t.account_id === accountId);
}

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  start: string,
  end: string
): Transaction[] {
  return transactions.filter((t) => t.date >= start && t.date <= end);
}

export function filterTransactionsByCategory(
  transactions: Transaction[],
  category: string | null
): Transaction[] {
  if (!category) return transactions;
  return transactions.filter((t) => t.category === category);
}

export interface FinancialSummary {
  totalIncome: number;
  totalOutflows: number;
  surplus: number;
  byCategory: { category: string; amount: number; percentage: number }[];
  transactionCount: number;
}

export function txAmountInCurrency(
  tx: Transaction,
  displayCurrency: Currency,
  rates?: Record<string, number>,
  rateBase?: Currency
): number {
  const amount = Math.abs(Number(tx.amount));
  if (!rates || !rateBase) return amount;
  return convertWithRates(amount, tx.currency, displayCurrency, rates, rateBase);
}

export function computeSummaryWithFx(
  transactions: Transaction[],
  displayCurrency?: Currency,
  rates?: Record<string, number>,
  rateBase?: Currency
): FinancialSummary {
  const income = transactions.filter((t) => t.is_income);
  const expenses = transactions.filter((t) => !t.is_income);

  const totalIncome = income.reduce(
    (sum, t) =>
      sum +
      txAmountInCurrency(
        t,
        displayCurrency ?? (t.currency as Currency),
        rates,
        rateBase
      ),
    0
  );
  const totalOutflows = expenses.reduce(
    (sum, t) =>
      sum +
      txAmountInCurrency(
        t,
        displayCurrency ?? (t.currency as Currency),
        rates,
        rateBase
      ),
    0
  );

  const categoryMap = new Map<string, number>();
  for (const t of expenses) {
    const amt = txAmountInCurrency(
      t,
      displayCurrency ?? (t.currency as Currency),
      rates,
      rateBase
    );
    const current = categoryMap.get(t.category) ?? 0;
    categoryMap.set(t.category, current + amt);
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

export function computeSummary(transactions: Transaction[]): FinancialSummary {
  return computeSummaryWithFx(transactions);
}

export function computePriorPeriodSummary(
  transactions: Transaction[],
  periodStart: string,
  periodEnd: string,
  displayCurrency: Currency,
  rates?: Record<string, number>,
  rateBase?: Currency
): FinancialSummary {
  const start = new Date(`${periodStart}T00:00:00`);
  const end = new Date(`${periodEnd}T00:00:00`);
  const durationMs = end.getTime() - start.getTime();
  const priorEnd = new Date(start.getTime() - 86400000);
  const priorStart = new Date(priorEnd.getTime() - durationMs);

  const priorStartStr = priorStart.toISOString().slice(0, 10);
  const priorEndStr = priorEnd.toISOString().slice(0, 10);

  const priorTx = filterTransactionsByPeriod(transactions, priorStartStr, priorEndStr);
  return computeSummaryWithFx(priorTx, displayCurrency, rates, rateBase);
}

export function detectRecurring(transactions: Transaction[]): string[] {
  const descCounts = new Map<string, number>();
  for (const t of transactions) {
    if (t.is_income) continue;
    const key = normalizeMerchantKey(t.description);
    descCounts.set(key, (descCounts.get(key) ?? 0) + 1);
  }
  return Array.from(descCounts.entries())
    .filter(([, count]) => count >= 2)
    .map(([desc]) => desc)
    .slice(0, 5);
}

export function normalizeMerchantKey(description: string): string {
  return description.toLowerCase().trim().slice(0, 30);
}

export interface TransactionTrend {
  pctChange: number;
  label: string;
  highlight: boolean;
}

function daysBetween(priorDate: string, currentDate: string): number {
  const prior = new Date(`${priorDate}T00:00:00`);
  const current = new Date(`${currentDate}T00:00:00`);
  return Math.round((current.getTime() - prior.getTime()) / (1000 * 60 * 60 * 24));
}

const MONTHLY_BILL_CATEGORIES = new Set([
  "subscriptions",
  "rent-housing",
  "utilities",
  "loan",
]);

const MONTHLY_INTERVAL_MIN_DAYS = 25;
const MONTHLY_INTERVAL_MAX_DAYS = 40;

export function computeRepeatedTransactionTrend(
  tx: Transaction,
  allTransactions: Transaction[]
): TransactionTrend | null {
  if (tx.is_income) return null;
  if (!MONTHLY_BILL_CATEGORIES.has(tx.category)) return null;

  const key = normalizeMerchantKey(tx.description);
  const merchantTxs = allTransactions.filter(
    (t) => !t.is_income && normalizeMerchantKey(t.description) === key
  );
  if (merchantTxs.length < 2) return null;

  const prior = merchantTxs
    .filter((t) => t.date < tx.date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  if (!prior) return null;

  const days = daysBetween(prior.date, tx.date);
  if (days < MONTHLY_INTERVAL_MIN_DAYS || days > MONTHLY_INTERVAL_MAX_DAYS) return null;

  const currentAmount = Math.abs(Number(tx.amount));
  const priorAmount = Math.abs(Number(prior.amount));
  if (priorAmount === 0) return null;

  const pctChange = ((currentAmount - priorAmount) / priorAmount) * 100;
  if (Math.abs(pctChange) < 1) return null;

  const absPct = Math.round(Math.abs(pctChange));
  const arrow = pctChange > 0 ? "↑" : "↓";

  return {
    pctChange,
    label: `${arrow} ${absPct}% vs last month`,
    highlight: pctChange > 0 && Math.abs(pctChange) >= 5,
  };
}

export interface MonthlyTrendPoint {
  monthKey: string;
  label: string;
  income: number;
  outflows: number;
  net: number;
}

export function computeMonthlyTrend(
  transactions: Transaction[],
  months = 12,
  displayCurrency?: Currency,
  rates?: Record<string, number>,
  rateBase?: Currency,
  buckets?: MonthBucket[]
): MonthlyTrendPoint[] {
  const monthBuckets = buckets ?? getMonthBucketsRolling(months);
  const points: MonthlyTrendPoint[] = [];

  for (const { monthKey, label, start, end } of monthBuckets) {
    const bucket = transactions.filter((t) => t.date >= start && t.date <= end);
    const income = bucket
      .filter((t) => t.is_income)
      .reduce(
        (sum, t) =>
          sum +
          txAmountInCurrency(
            t,
            displayCurrency ?? (t.currency as Currency),
            rates,
            rateBase
          ),
        0
      );
    const outflows = bucket
      .filter((t) => !t.is_income)
      .reduce(
        (sum, t) =>
          sum +
          txAmountInCurrency(
            t,
            displayCurrency ?? (t.currency as Currency),
            rates,
            rateBase
          ),
        0
      );

    points.push({
      monthKey,
      label,
      income,
      outflows,
      net: income - outflows,
    });
  }

  return points;
}

export interface CategoryMonthlyPoint {
  monthKey: string;
  label: string;
  amount: number;
}

export function getTopCategory(summary: FinancialSummary): string | null {
  return summary.byCategory[0]?.category ?? null;
}

export function computeCategoryMonthlyTrend(
  transactions: Transaction[],
  categorySlug: string,
  months = 12
): CategoryMonthlyPoint[] {
  return computeMultiCategoryMonthlyTrend(transactions, [categorySlug], months).map(
    (row) => ({
      monthKey: row.monthKey as string,
      label: row.label as string,
      amount: (row[categorySlug] as number) ?? 0,
    })
  );
}

export function getCategoriesWithSpending(
  transactions: Transaction[],
  months = 12,
  buckets?: MonthBucket[]
): { slug: string; total: number }[] {
  const expenseSlugs = SYSTEM_CATEGORIES.filter((c) => c.slug !== "income").map(
    (c) => c.slug
  );

  return expenseSlugs
    .map((slug) => {
      const points = computeMultiCategoryMonthlyTrend(
        transactions,
        [slug],
        months,
        undefined,
        undefined,
        undefined,
        buckets
      );
      const total = points.reduce((sum, p) => sum + ((p[slug] as number) ?? 0), 0);
      return { slug, total };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}

export function computeMultiCategoryMonthlyTrend(
  transactions: Transaction[],
  categorySlugs: string[],
  months = 12,
  displayCurrency?: Currency,
  rates?: Record<string, number>,
  rateBase?: Currency,
  buckets?: MonthBucket[]
): Record<string, string | number>[] {
  if (categorySlugs.length === 0) return [];

  const monthBuckets = buckets ?? getMonthBucketsRolling(months);
  const slugSet = new Set(categorySlugs);
  const expenseTx = transactions.filter(
    (t) => !t.is_income && slugSet.has(t.category)
  );

  const points: Record<string, string | number>[] = [];

  for (const { monthKey, label, start, end } of monthBuckets) {
    const row: Record<string, string | number> = { monthKey, label };

    for (const slug of categorySlugs) {
      row[slug] = 0;
    }

    for (const t of expenseTx) {
      if (t.date >= start && t.date <= end && slugSet.has(t.category)) {
        const amt = txAmountInCurrency(
          t,
          displayCurrency ?? (t.currency as Currency),
          rates,
          rateBase
        );
        row[t.category] = ((row[t.category] as number) ?? 0) + amt;
      }
    }

    points.push(row);
  }

  return points;
}
