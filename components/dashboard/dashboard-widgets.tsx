"use client";

import { EditorialCard } from "@/components/ui/editorial-card";
import { formatCurrencyPlain, type FinancialSummary } from "@/lib/finance/aggregates";
import type { Currency } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { brandClasses } from "@/lib/brand";

interface PeriodHeroProps {
  summary: FinancialSummary;
  priorSummary: FinancialSummary;
  currency: Currency;
  periodLabel: string;
  categoryLabel?: string;
}

function pctChange(current: number, prior: number): number | null {
  if (prior === 0) return null;
  return ((current - prior) / prior) * 100;
}

function DeltaBadge({ current, prior, invert }: { current: number; prior: number; invert?: boolean }) {
  const change = pctChange(current, prior);
  if (change === null || Math.abs(change) < 1) return null;
  const isUp = change > 0;
  const bad = invert ? isUp : !isUp;
  return (
    <span
      className={cn(
        "text-[10px] font-semibold",
        bad ? "text-destructive" : "text-success"
      )}
    >
      {isUp ? "↑" : "↓"} {Math.abs(Math.round(change))}% vs prior period
    </span>
  );
}

export function PeriodHero({
  summary,
  priorSummary,
  currency,
  periodLabel,
  categoryLabel,
}: PeriodHeroProps) {
  const subtitle = [
    `${summary.transactionCount} transactions`,
    categoryLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <EditorialCard title={periodLabel} index="PERIOD" subtitle={subtitle}>
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Spent
          </p>
          <p className={`${brandClasses.mockSerifStat} mt-1 text-foreground`}>
            {formatCurrencyPlain(summary.totalOutflows, currency)}
          </p>
          <DeltaBadge current={summary.totalOutflows} prior={priorSummary.totalOutflows} invert />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Income
          </p>
          <p className={`${brandClasses.mockSerifStat} mt-1 text-success`}>
            {formatCurrencyPlain(summary.totalIncome, currency)}
          </p>
          <DeltaBadge current={summary.totalIncome} prior={priorSummary.totalIncome} />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Surplus
          </p>
          <p
            className={cn(
              brandClasses.mockSerifStat,
              "mt-1",
              summary.surplus >= 0 ? "text-success" : "text-destructive"
            )}
          >
            {summary.surplus >= 0 ? "+" : ""}
            {formatCurrencyPlain(summary.surplus, currency)}
          </p>
        </div>
      </div>
    </EditorialCard>
  );
}
