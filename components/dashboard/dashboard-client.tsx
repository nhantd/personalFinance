"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { PeriodHero } from "@/components/dashboard/dashboard-widgets";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SpendingBreakdown } from "@/components/dashboard/spending-breakdown";
import { TrendPanel } from "@/components/dashboard/trend-panel";
import { getPeriodIndexFromParams } from "@/components/filters/finance-filters";
import {
  computePriorPeriodSummary,
  computeSummaryWithFx,
  filterTransactionsByAccount,
  filterTransactionsByPeriod,
  resolvePeriodFromParams,
} from "@/lib/finance/aggregates";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { SpendingBodySkeleton } from "@/components/skeletons/page-skeletons";
import { useFilterNavigation } from "@/hooks/use-filter-navigation";
import type { Account, Currency, Transaction } from "@/lib/types/database";
import { SYSTEM_CATEGORIES } from "@/lib/types/database";
import { ButtonLink } from "@/components/ui/button-link";
import { CurrencyHint } from "@/components/ui/currency-badge";
import { brandClasses } from "@/lib/brand";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { OTHER_CATEGORY } from "@/components/dashboard/chart-colors";

interface DashboardClientProps {
  transactions: Transaction[];
  accounts: Account[];
  profileCurrency: Currency;
  fxRates: Record<string, number>;
}

export function DashboardClient({
  transactions,
  accounts,
  profileCurrency,
  fxRates,
}: DashboardClientProps) {
  const searchParams = useSearchParams();
  const { updateParams, isPending } = useFilterNavigation("/dashboard");

  const period = resolvePeriodFromParams(searchParams, 0);
  const periodIndex = getPeriodIndexFromParams(searchParams, 0);
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const from = fromParam || period.start;
  const to = toParam || period.end;
  const accountParam = searchParams.get("account") ?? "all";
  const categoryParam = searchParams.get("category");

  function handleSelectCategory(category: string | null) {
    if (!category || category === OTHER_CATEGORY) {
      updateParams({ category: null });
      return;
    }
    updateParams({ category: categoryParam === category ? null : category });
  }

  const selectedCategory =
    categoryParam && categoryParam !== OTHER_CATEGORY ? categoryParam : null;

  let scoped = filterTransactionsByPeriod(transactions, from, to);
  scoped = filterTransactionsByAccount(
    scoped,
    accountParam === "all" ? null : accountParam
  );
  if (selectedCategory) {
    scoped = scoped.filter((t) => t.category === selectedCategory);
  }

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

  let trendTx = transactions;
  if (accountParam !== "all") {
    trendTx = filterTransactionsByAccount(trendTx, accountParam);
  }

  const spendingSummary = selectedCategory
    ? computeSummaryWithFx(
        filterTransactionsByPeriod(
          filterTransactionsByAccount(
            transactions,
            accountParam === "all" ? null : accountParam
          ),
          from,
          to
        ),
        displayCurrency,
        fxRates,
        profileCurrency
      )
    : summary;

  const categoryLabel = selectedCategory
    ? SYSTEM_CATEGORIES.find((c) => c.slug === selectedCategory)?.label
    : undefined;

  const viewAllParams = new URLSearchParams();
  if (fromParam) viewAllParams.set("from", from);
  if (toParam) viewAllParams.set("to", to);
  if (!fromParam && !toParam && periodIndex !== null) {
    viewAllParams.set("period", String(periodIndex));
  }
  if (accountParam !== "all") viewAllParams.set("account", accountParam);
  if (selectedCategory) viewAllParams.set("category", selectedCategory);
  const viewAllHref = `/transactions?${viewAllParams.toString()}`;

  const isMixed = transactions.some((t) => t.currency !== profileCurrency);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-light tracking-tight">Spending</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track spending and see where your money goes
            {isMixed && (
              <span className="ml-1 inline-flex items-center gap-1">
                · totals in <CurrencyHint code={displayCurrency} className="inline-flex" />
              </span>
            )}
          </p>
        </div>
        {transactions.length === 0 ? (
          <ButtonLink href="/upload" variant="outline" className="px-4">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </ButtonLink>
        ) : (
          <TransactionFormDialog accounts={accounts} />
        )}
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
            Upload your first bank statement to see spending insights.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/upload" className={brandClasses.btnPrimary}>
              Upload statement
            </ButtonLink>
            <TransactionFormDialog accounts={accounts} triggerVariant="outline" />
          </div>
        </div>
      ) : isPending ? (
        <SpendingBodySkeleton />
      ) : (
        <div className="space-y-6">
          <PeriodHero
            summary={summary}
            priorSummary={priorSummary}
            currency={displayCurrency}
            periodLabel={period.label}
            categoryLabel={categoryLabel}
          />
          <SpendingBreakdown
            summary={spendingSummary}
            currency={displayCurrency}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
          <TrendPanel
            transactions={trendTx}
            currency={displayCurrency}
            rates={fxRates}
            rateBase={profileCurrency}
          />
          <RecentActivity
            transactions={scoped}
            allTransactions={transactions}
            viewAllHref={viewAllHref}
          />
        </div>
      )}
    </div>
  );
}
