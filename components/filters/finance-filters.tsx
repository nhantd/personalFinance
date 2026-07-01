"use client";

import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterControlClass } from "@/components/ui/editorial-card";
import {
  getPeriodFilters,
  DEFAULT_PERIOD_PRESET_INDEX,
  type PeriodFilter,
} from "@/lib/finance/aggregates";
import { SYSTEM_CATEGORIES, type Account } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const controlClass = cn(filterControlClass, "h-9 border-border/60 bg-background text-sm");
const pillClass =
  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap";

export interface FinanceFiltersProps {
  period: PeriodFilter;
  periodIndex: number | null;
  from: string;
  to: string;
  accountId: string;
  accounts: Account[];
  categoryValue?: string;
  filteredCount?: number;
  totalCount?: number;
  onUpdate: (updates: Record<string, string | null>) => void;
}

export function FinanceFilters({
  period,
  periodIndex,
  from,
  to,
  accountId,
  accounts,
  categoryValue = "all",
  filteredCount,
  totalCount,
  onUpdate,
}: FinanceFiltersProps) {
  const periodPresets = getPeriodFilters();
  const isCustom = period.label === "Custom";
  const activePreset =
    periodIndex !== null && !isCustom ? periodPresets[periodIndex]?.label : null;

  const accountItems = [
    { value: "all", label: "All accounts" },
    ...accounts.map((a) => ({
      value: a.id,
      label: a.institution ? `${a.name} · ${a.institution}` : a.name,
    })),
  ];

  const categoryItems = [
    { value: "all", label: "All categories" },
    ...SYSTEM_CATEGORIES.map((c) => ({ value: c.slug, label: c.label })),
  ];

  const hasFilters = Boolean(
    from ||
      to ||
      (categoryValue && categoryValue !== "all") ||
      (accountId && accountId !== "all")
  );

  function applyPreset(index: number) {
    onUpdate({
      period: String(index),
      from: null,
      to: null,
    });
  }

  const showFooter = filteredCount !== undefined && totalCount !== undefined;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-3">
        <div
          className="flex shrink-0 flex-wrap gap-0.5 rounded-lg border border-border/60 bg-muted/20 p-0.5"
          role="group"
          aria-label="Summary period"
        >
          {periodPresets.map((preset, index) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(index)}
              className={cn(
                pillClass,
                activePreset === preset.label
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 lg:justify-end">
          <DatePicker
            id="filter-from"
            value={from}
            aria-label="From date"
            onChange={(next) =>
              onUpdate({
                from: next || null,
                to: to || null,
                period: null,
              })
            }
            className={cn(controlClass, "w-full min-w-0 sm:w-[9.5rem]")}
          />
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">–</span>
          <DatePicker
            id="filter-to"
            value={to}
            aria-label="To date"
            onChange={(next) =>
              onUpdate({
                from: from || null,
                to: next || null,
                period: null,
              })
            }
            className={cn(controlClass, "w-full min-w-0 sm:w-[9.5rem]")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <Select
          value={accountId}
          items={accountItems}
          onValueChange={(v) => onUpdate({ account: v === "all" ? null : v })}
        >
          <SelectTrigger className={cn(controlClass, "w-full sm:w-[11rem]")} aria-label="Account">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accountItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryValue}
          items={categoryItems}
          onValueChange={(v) => onUpdate({ category: v === "all" ? null : v })}
        >
          <SelectTrigger className={cn(controlClass, "w-full sm:w-[11rem]")} aria-label="Category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showFooter && (
          <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:ml-auto sm:w-auto">
            <span className="whitespace-nowrap">
              {filteredCount} of {totalCount}
              {isCustom ? " · custom" : activePreset ? ` · ${activePreset}` : ""}
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    from: null,
                    to: null,
                    category: null,
                    account: null,
                    period: String(DEFAULT_PERIOD_PRESET_INDEX),
                  })
                }
                className="font-medium text-accent hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function getPeriodIndexFromParams(
  searchParams: { get: (key: string) => string | null },
  defaultIndex = DEFAULT_PERIOD_PRESET_INDEX
): number | null {
  if (searchParams.get("from") || searchParams.get("to")) return null;
  const periods = getPeriodFilters();
  const raw = parseInt(searchParams.get("period") ?? String(defaultIndex), 10);
  return Number.isFinite(raw) && raw >= 0 && raw < periods.length ? raw : defaultIndex;
}
