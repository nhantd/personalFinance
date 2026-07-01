"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EditorialCard } from "@/components/ui/editorial-card";
import { formatCurrencyPlain, type FinancialSummary } from "@/lib/finance/aggregates";
import { SYSTEM_CATEGORIES, type Currency } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { CHART_COLORS, OTHER_CATEGORY } from "@/components/dashboard/chart-colors";

const TOP_N = 6;

interface CategorySlice {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

function buildSlices(summary: FinancialSummary): CategorySlice[] {
  const categories = summary.byCategory;
  if (categories.length === 0) return [];

  const top = categories.slice(0, TOP_N);
  const rest = categories.slice(TOP_N);
  const otherAmount = rest.reduce((sum, c) => sum + c.amount, 0);
  const otherPct = rest.reduce((sum, c) => sum + c.percentage, 0);

  const slices: CategorySlice[] = top.map((c, i) => ({
    category: c.category,
    label: SYSTEM_CATEGORIES.find((s) => s.slug === c.category)?.label ?? c.category,
    amount: c.amount,
    percentage: c.percentage,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  if (otherAmount > 0) {
    slices.push({
      category: OTHER_CATEGORY,
      label: "Other",
      amount: otherAmount,
      percentage: otherPct,
      color: CHART_COLORS[TOP_N % CHART_COLORS.length],
    });
  }

  return slices;
}

interface SpendingBreakdownProps {
  summary: FinancialSummary;
  currency: Currency;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function SpendingBreakdown({
  summary,
  currency,
  selectedCategory,
  onSelectCategory,
}: SpendingBreakdownProps) {
  const slices = useMemo(() => buildSlices(summary), [summary]);
  const maxAmount = slices[0]?.amount ?? 1;

  if (slices.length === 0) {
    return (
      <EditorialCard title="Spending" index="CATEGORIES">
        <p className="text-sm text-muted-foreground">No expense data for this period.</p>
      </EditorialCard>
    );
  }

  function handleSelect(category: string) {
    onSelectCategory(selectedCategory === category ? null : category);
  }

  return (
    <EditorialCard
      title="Spending"
      index="CATEGORIES"
      subtitle="Click a category to filter activity below"
      headerAction={
        selectedCategory ? (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="text-[10px] font-medium uppercase tracking-widest text-accent hover:underline"
          >
            All categories
          </button>
        ) : undefined
      }
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="relative mx-auto h-56 w-full max-w-xs lg:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="88%"
                paddingAngle={2}
                stroke="var(--card)"
                strokeWidth={2}
                onClick={(_, index) => {
                  const slice = slices[index];
                  if (slice) handleSelect(slice.category);
                }}
                style={{ cursor: "pointer" }}
              >
                {slices.map((slice) => (
                  <Cell
                    key={slice.category}
                    fill={slice.color}
                    opacity={
                      selectedCategory && selectedCategory !== slice.category ? 0.35 : 1
                    }
                    stroke={
                      selectedCategory === slice.category ? "var(--foreground)" : undefined
                    }
                    strokeWidth={selectedCategory === slice.category ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrencyPlain(Number(value), currency)}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Total spent
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrencyPlain(summary.totalOutflows, currency)}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {slices.map((slice) => {
            const widthPct = (slice.amount / maxAmount) * 100;
            const active = selectedCategory === slice.category;
            const dimmed = selectedCategory && !active;

            return (
              <button
                key={slice.category}
                type="button"
                onClick={() => handleSelect(slice.category)}
                className={cn(
                  "block w-full rounded-lg px-2 py-1.5 text-left transition-colors",
                  active && "bg-muted/60",
                  !active && "hover:bg-muted/30",
                  dimmed && "opacity-45"
                )}
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium">{slice.label}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {formatCurrencyPlain(slice.amount, currency)}{" "}
                    <span className="text-[10px]">({slice.percentage.toFixed(0)}%)</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: slice.color,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </EditorialCard>
  );
}
