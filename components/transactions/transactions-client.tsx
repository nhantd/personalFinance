"use client";

import { useSearchParams } from "next/navigation";
import { Upload } from "lucide-react";
import { TransactionFilters, getPeriodIndexFromParams } from "@/components/transactions/transaction-filters";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionsContentSkeleton } from "@/components/skeletons/page-skeletons";
import { useFilterNavigation } from "@/hooks/use-filter-navigation";
import { ButtonLink } from "@/components/ui/button-link";
import {
  filterTransactionsByAccount,
  filterTransactionsByCategory,
  filterTransactionsByPeriod,
  resolvePeriodFromParams,
} from "@/lib/finance/aggregates";
import type { Account, Currency, Transaction } from "@/lib/types/database";

interface TransactionsClientProps {
  transactions: Transaction[];
  accounts: Account[];
  profileCurrency: Currency;
}

export function TransactionsClient({
  transactions,
  accounts,
  profileCurrency: _profileCurrency,
}: TransactionsClientProps) {
  const searchParams = useSearchParams();
  const { updateParams, isPending } = useFilterNavigation("/transactions");

  const category = searchParams.get("category");
  const categoryValue = category ?? "all";
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const accountParam = searchParams.get("account") ?? "all";
  const period = resolvePeriodFromParams(searchParams);
  const periodIndex = getPeriodIndexFromParams(searchParams);

  const from = fromParam || (period.label !== "Custom" ? period.start : "");
  const to = toParam || (period.label !== "Custom" ? period.end : "");

  let filtered = transactions;

  if (from && to) {
    filtered = filterTransactionsByPeriod(filtered, from, to);
  } else if (from) {
    filtered = filtered.filter((t) => t.date >= from);
  } else if (to) {
    filtered = filtered.filter((t) => t.date <= to);
  }

  filtered = filterTransactionsByCategory(
    filtered,
    categoryValue === "all" ? null : categoryValue
  );

  filtered = filterTransactionsByAccount(
    filtered,
    accountParam === "all" ? null : accountParam
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-light tracking-tight">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All parsed transactions. Edit inline or add manual entries.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonLink href="/upload" variant="outline" size="sm" className="h-8">
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Upload statement</span>
            <span className="sm:hidden">Upload</span>
          </ButtonLink>
          <TransactionFormDialog accounts={accounts} />
        </div>
      </div>

      <TransactionFilters
        categoryValue={categoryValue}
        from={from}
        to={to}
        accountId={accountParam}
        accounts={accounts}
        periodIndex={periodIndex}
        periodLabel={period.label}
        filteredCount={filtered.length}
        totalCount={transactions.length}
        onUpdate={updateParams}
      />

      {isPending ? (
        <TransactionsContentSkeleton />
      ) : (
        <TransactionsTable
          key={`${categoryValue}-${from}-${to}-${accountParam}-${filtered.length}`}
          initialTransactions={filtered}
          fallbackCurrency={_profileCurrency}
        />
      )}
    </div>
  );
}
