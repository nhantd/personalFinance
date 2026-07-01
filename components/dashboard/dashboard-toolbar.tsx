"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterControlClass } from "@/components/ui/editorial-card";
import { getPeriodFilters, type PeriodFilter } from "@/lib/finance/aggregates";
import type { Account } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const controlClass = cn(filterControlClass, "h-9 border-border/60 bg-background text-sm");
const pillClass =
  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap";

export interface DashboardToolbarProps {
  period: PeriodFilter;
  periodIndex: number | null;
  from: string;
  to: string;
  accountId: string;
  accounts: Account[];
  onUpdate: (updates: Record<string, string | null>) => void;
}

export function DashboardToolbar({
  periodIndex,
  from,
  to,
  accountId,
  accounts,
  onUpdate,
}: DashboardToolbarProps) {
  const periodPresets = getPeriodFilters();
  const isCustom = periodIndex === null;
  const activePreset =
    periodIndex !== null && !isCustom ? periodPresets[periodIndex]?.label : null;

  const accountItems = [
    { value: "all", label: "All accounts" },
    ...accounts.map((a) => ({
      value: a.id,
      label: a.institution ? `${a.name} · ${a.institution}` : a.name,
    })),
  ];

  function applyPreset(index: number) {
    onUpdate({
      period: String(index),
      from: null,
      to: null,
    });
  }

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
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

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Input
          id="dashboard-from"
          type="date"
          value={from}
          aria-label="From date"
          onChange={(e) =>
            onUpdate({
              from: e.target.value || null,
              to: to || null,
              period: null,
            })
          }
          className={cn(controlClass, "w-full min-w-0 sm:w-[9.5rem]")}
        />
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">–</span>
        <Input
          id="dashboard-to"
          type="date"
          value={to}
          aria-label="To date"
          onChange={(e) =>
            onUpdate({
              from: from || null,
              to: e.target.value || null,
              period: null,
            })
          }
          className={cn(controlClass, "w-full min-w-0 sm:w-[9.5rem]")}
        />
      </div>

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
    </div>
  );
}
