"use client";

import { EditorialCard } from "@/components/ui/editorial-card";
import { FinanceFilters } from "@/components/filters/finance-filters";
import type { Account } from "@/lib/types/database";

interface TransactionFiltersProps {
  categoryValue: string;
  from: string;
  to: string;
  accountId: string;
  accounts: Account[];
  periodIndex: number | null;
  periodLabel: string;
  filteredCount: number;
  totalCount: number;
  onUpdate: (updates: Record<string, string | null>) => void;
}

export function TransactionFilters({
  categoryValue,
  from,
  to,
  accountId,
  accounts,
  periodIndex,
  periodLabel,
  filteredCount,
  totalCount,
  onUpdate,
}: TransactionFiltersProps) {
  return (
    <EditorialCard title="Filters" variant="compact">
      <FinanceFilters
        period={{ label: periodLabel, start: from, end: to }}
        periodIndex={periodIndex}
        from={from}
        to={to}
        accountId={accountId}
        accounts={accounts}
        categoryValue={categoryValue}
        filteredCount={filteredCount}
        totalCount={totalCount}
        onUpdate={onUpdate}
      />
    </EditorialCard>
  );
}

export { getPeriodIndexFromParams } from "@/components/filters/finance-filters";
