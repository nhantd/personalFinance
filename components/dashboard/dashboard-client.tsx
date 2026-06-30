"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CategoryChart,
  RecentTransactions,
  SummaryCards,
} from "@/components/dashboard/dashboard-widgets";
import {
  computeSummary,
  filterTransactionsByPeriod,
  getPeriodFilters,
} from "@/lib/finance/aggregates";
import type { Currency, Transaction } from "@/lib/types/database";
import { ButtonLink } from "@/components/ui/button-link";
import { Upload } from "lucide-react";

interface DashboardClientProps {
  transactions: Transaction[];
  currency: Currency;
}

export function DashboardClient({ transactions, currency }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periods = getPeriodFilters();
  const periodIndex = parseInt(searchParams.get("period") ?? "2", 10);
  const period = periods[periodIndex] ?? periods[2];

  const filtered = filterTransactionsByPeriod(transactions, period.start, period.end);
  const summary = computeSummary(filtered);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">{period.label} · {summary.transactionCount} transactions</p>
        </div>
        <div className="flex gap-3">
          <Select
            value={String(periodIndex)}
            onValueChange={(v) => v && router.push(`/dashboard?period=${v}`)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p, i) => (
                <SelectItem key={p.label} value={String(i)}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ButtonLink href="/upload" variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </ButtonLink>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 py-16 text-center">
          <p className="text-lg font-medium">No data yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload your first bank statement to see spending insights.
          </p>
          <ButtonLink href="/upload" className="mt-6 bg-emerald-600 hover:bg-emerald-500">
            Upload statement
          </ButtonLink>
        </div>
      ) : (
        <>
          <SummaryCards summary={summary} currency={currency} />
          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryChart summary={summary} currency={currency} />
            <RecentTransactions transactions={filtered} currency={currency} />
          </div>
        </>
      )}
    </div>
  );
}
