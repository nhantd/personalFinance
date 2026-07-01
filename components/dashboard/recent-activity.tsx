"use client";

import Link from "next/link";
import { EditorialCard } from "@/components/ui/editorial-card";
import { CategoryPill } from "@/components/ui/category-pill";
import { computeRepeatedTransactionTrend, formatCurrencyPlain } from "@/lib/finance/aggregates";
import type { Currency, Transaction } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import { brandClasses } from "@/lib/brand";

function formatShortDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface RecentActivityProps {
  transactions: Transaction[];
  allTransactions: Transaction[];
  viewAllHref: string;
}

export function RecentActivity({
  transactions,
  allTransactions,
  viewAllHref,
}: RecentActivityProps) {
  const recent = transactions.slice(0, 8);

  return (
    <EditorialCard
      title="Recent activity"
      index="RECENT"
      headerAction={
        <Link
          href={viewAllHref}
          className="text-[10px] font-medium uppercase tracking-widest text-accent hover:underline"
        >
          View all
        </Link>
      }
    >
      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transactions in this period.</p>
      ) : (
        <div className="divide-y divide-border/60">
          {recent.map((tx) => {
            const trend = computeRepeatedTransactionTrend(tx, allTransactions);

            return (
              <div
                key={tx.id}
                className={cn(
                  "group flex items-center gap-3 py-3 first:pt-0 last:pb-0",
                  trend?.highlight && "rounded-md bg-highlight-warm-bg/40 px-2 -mx-2"
                )}
                title={trend?.label}
              >
                <span className="w-14 shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatShortDate(tx.date)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {tx.description}
                </span>
                <CategoryPill slug={tx.category} />
                <span
                  className={cn(
                    "shrink-0 text-right text-sm tabular-nums",
                    tx.is_income ? brandClasses.income : "text-foreground"
                  )}
                >
                  {tx.is_income ? "+" : "−"}
                  {formatCurrencyPlain(Math.abs(Number(tx.amount)), tx.currency as Currency)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </EditorialCard>
  );
}
