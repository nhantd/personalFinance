"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyPlain, type FinancialSummary } from "@/lib/finance/aggregates";
import type { Currency, Transaction } from "@/lib/types/database";
import { SYSTEM_CATEGORIES } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
  "#facc15",
  "#94a3b8",
];

interface SummaryCardsProps {
  summary: FinancialSummary;
  currency: Currency;
}

export function SummaryCards({ summary, currency }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-emerald-400">
            {formatCurrencyPlain(summary.totalIncome, currency)}
          </p>
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Outflows</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatCurrencyPlain(summary.totalOutflows, currency)}
          </p>
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Surplus</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              "text-2xl font-bold",
              summary.surplus >= 0 ? "text-emerald-400" : "text-destructive"
            )}
          >
            {summary.surplus >= 0 ? "+" : ""}
            {formatCurrencyPlain(summary.surplus, currency)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface CategoryChartProps {
  summary: FinancialSummary;
  currency: Currency;
}

export function CategoryChart({ summary, currency }: CategoryChartProps) {
  const data = summary.byCategory.slice(0, 8).map((c) => ({
    name: SYSTEM_CATEGORIES.find((s) => s.slug === c.category)?.label ?? c.category,
    amount: c.amount,
    percentage: c.percentage,
  }));

  if (data.length === 0) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Spending by category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No expense data yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                formatter={(value) => formatCurrencyPlain(Number(value), currency)}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: Currency;
}

export function RecentTransactions({ transactions, currency }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 10);

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet. Upload a statement to get started.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.date} · {SYSTEM_CATEGORIES.find((c) => c.slug === tx.category)?.label ?? tx.category}
                  </p>
                </div>
                <p className={cn("text-sm font-mono", tx.is_income ? "text-emerald-400" : "")}>
                  {tx.is_income ? "+" : "−"}
                  {formatCurrencyPlain(Math.abs(Number(tx.amount)), currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
