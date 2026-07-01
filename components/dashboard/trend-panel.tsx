"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EditorialCard } from "@/components/ui/editorial-card";
import {
  computeMultiCategoryMonthlyTrend,
  computeMonthlyTrend,
  formatCurrencyPlain,
  getCategoriesWithSpending,
  getMonthBucketsRolling,
} from "@/lib/finance/aggregates";
import type { Currency, Transaction } from "@/lib/types/database";
import { SYSTEM_CATEGORIES } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/colors";
import { CHART_COLORS } from "@/components/dashboard/chart-colors";

const TREND_MONTHS = [
  { value: 3, label: "3M" },
  { value: 6, label: "6M" },
  { value: 12, label: "12M" },
  { value: 24, label: "24M" },
] as const;

type TrendView = "category" | "cashflow";

function categoryLabel(slug: string): string {
  return SYSTEM_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

const pillClass =
  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap";

interface TrendPanelProps {
  transactions: Transaction[];
  currency: Currency;
  rates?: Record<string, number>;
  rateBase?: Currency;
}

export function TrendPanel({ transactions, currency, rates, rateBase }: TrendPanelProps) {
  const [months, setMonths] = useState(12);
  const [view, setView] = useState<TrendView>("category");

  const buckets = useMemo(() => getMonthBucketsRolling(months), [months]);
  const trendLabel = `Last ${months} months`;

  const categoriesWithSpend = useMemo(
    () => getCategoriesWithSpending(transactions, months, buckets).slice(0, 6),
    [transactions, months, buckets]
  );

  const slugs = useMemo(
    () => categoriesWithSpend.map((c) => c.slug),
    [categoriesWithSpend]
  );

  const categoryChartData = useMemo(
    () =>
      computeMultiCategoryMonthlyTrend(
        transactions,
        slugs,
        months,
        currency,
        rates,
        rateBase,
        buckets
      ),
    [transactions, slugs, months, currency, rates, rateBase, buckets]
  );

  const cashFlowData = useMemo(
    () =>
      computeMonthlyTrend(transactions, months, currency, rates, rateBase, buckets),
    [transactions, months, currency, rates, rateBase, buckets]
  );

  const hasCategoryData = categoryChartData.some((row) =>
    slugs.some((slug) => ((row[slug] as number) ?? 0) > 0)
  );

  const hasCashFlowData = cashFlowData.some((d) => d.income > 0 || d.outflows > 0);

  const headerControls = (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="flex flex-wrap gap-0.5 rounded-lg border border-border/60 bg-muted/20 p-0.5"
        role="group"
        aria-label="Trend period"
      >
        {TREND_MONTHS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMonths(option.value)}
            className={cn(
              pillClass,
              months === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div
        className="flex gap-0.5 rounded-lg border border-border/60 bg-muted/20 p-0.5"
        role="group"
        aria-label="Trend view"
      >
        <button
          type="button"
          onClick={() => setView("category")}
          className={cn(
            pillClass,
            view === "category"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background hover:text-foreground"
          )}
        >
          By category
        </button>
        <button
          type="button"
          onClick={() => setView("cashflow")}
          className={cn(
            pillClass,
            view === "cashflow"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background hover:text-foreground"
          )}
        >
          Cash flow
        </button>
      </div>
    </div>
  );

  return (
    <EditorialCard
      title="Trends"
      index="TREND"
      subtitle={trendLabel}
      headerAction={headerControls}
    >
      {view === "category" ? (
        !hasCategoryData ? (
          <p className="text-sm text-muted-foreground">No category spending yet.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) =>
                    formatCurrencyPlain(Number(v), currency).replace(/\.\d{2}$/, "")
                  }
                  width={64}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrencyPlain(Number(value), currency),
                    categoryLabel(String(name)),
                  ]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  formatter={(value) => categoryLabel(String(value))}
                  wrapperStyle={{ fontSize: 11 }}
                />
                {slugs.map((slug, i) => (
                  <Bar
                    key={slug}
                    dataKey={slug}
                    stackId="spend"
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    radius={i === slugs.length - 1 ? [4, 4, 0, 0] : undefined}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      ) : !hasCashFlowData ? (
        <p className="text-sm text-muted-foreground">No transaction data yet.</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cashFlowData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) =>
                  formatCurrencyPlain(Number(v), currency).replace(/\.\d{2}$/, "")
                }
                width={72}
              />
              <Tooltip
                formatter={(value, name) => [
                  formatCurrencyPlain(Number(value), currency),
                  name === "income" ? "Income" : "Outflows",
                ]}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill={COLORS.success} radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflows" name="Outflows" fill={COLORS.tealMid} radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </EditorialCard>
  );
}
