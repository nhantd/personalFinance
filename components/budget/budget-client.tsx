"use client";

import { useSearchParams } from "next/navigation";
import { PeriodHero } from "@/components/dashboard/dashboard-widgets";
import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { SpendingBreakdown } from "@/components/dashboard/spending-breakdown";
import { getPeriodIndexFromParams } from "@/components/filters/finance-filters";
import {
  computePriorPeriodSummary,
  computeSummaryWithFx,
  filterTransactionsByAccount,
  filterTransactionsByPeriod,
  resolvePeriodFromParams,
} from "@/lib/finance/aggregates";
import { BudgetContentSkeleton } from "@/components/skeletons/page-skeletons";
import { useFilterNavigation } from "@/hooks/use-filter-navigation";
import type { Account, Currency, Transaction } from "@/lib/types/database";
import { ButtonLink } from "@/components/ui/button-link";
import { CurrencyHint } from "@/components/ui/currency-badge";
import { brandClasses } from "@/lib/brand";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetClientProps {
  transactions: Transaction[];
  accounts: Account[];
  profileCurrency: Currency;
  fxRates: Record<string, number>;
}

export function BudgetClient({
  transactions,
  accounts,
  profileCurrency,
  fxRates,
}: BudgetClientProps) {
  const searchParams = useSearchParams();
  const { updateParams, isPending } = useFilterNavigation("/budget");

  const period = resolvePeriodFromParams(searchParams);
  const periodIndex = getPeriodIndexFromParams(searchParams);
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const from = fromParam || period.start;
  const to = toParam || period.end;
  const accountParam = searchParams.get("account") ?? "all";

  let scoped = filterTransactionsByPeriod(transactions, from, to);
  scoped = filterTransactionsByAccount(
    scoped,
    accountParam === "all" ? null : accountParam
  );

  const displayCurrency = profileCurrency;
  const summary = computeSummaryWithFx(scoped, displayCurrency, fxRates, profileCurrency);
  const priorSummary = computePriorPeriodSummary(
    filterTransactionsByAccount(
      transactions,
      accountParam === "all" ? null : accountParam
    ),
    from,
    to,
    displayCurrency,
    fxRates,
    profileCurrency
  );

  const isMixed = transactions.some((t) => t.currency !== profileCurrency);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">Budget</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Income, spending, and cash left over
          {isMixed && (
            <span className="ml-1 inline-flex items-center gap-1">
              · totals in <CurrencyHint code={displayCurrency} className="inline-flex" />
            </span>
          )}
        </p>
      </div>

      {transactions.length > 0 && (
        <DashboardToolbar
          period={{ label: period.label, start: from, end: to }}
          periodIndex={periodIndex}
          from={from}
          to={to}
          accountId={accountParam}
          accounts={accounts}
          onUpdate={updateParams}
        />
      )}

      {transactions.length === 0 ? (
        <div className={cn(brandClasses.mockCard, "py-16 text-center")}>
          <p className="text-lg font-medium">No data yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a bank statement to see your income, spending, and surplus.
          </p>
          <ButtonLink href="/upload" className={`mt-6 ${brandClasses.btnPrimary}`}>
            <Upload className="mr-2 h-4 w-4 inline" />
            Upload statement
          </ButtonLink>
        </div>
      ) : isPending ? (
        <BudgetContentSkeleton />
      ) : (
        <div className="space-y-6">
          <PeriodHero
            summary={summary}
            priorSummary={priorSummary}
            currency={displayCurrency}
            periodLabel={period.label}
          />
          <SpendingBreakdown
            summary={summary}
            currency={displayCurrency}
            selectedCategory={null}
            onSelectCategory={() => {}}
          />
        </div>
      )}
    </div>
  );
}
