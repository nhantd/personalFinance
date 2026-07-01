"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EditorialCard } from "@/components/ui/editorial-card";
import { NetWorthEntryDialog } from "@/components/net-worth/net-worth-entry-dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrencyPlain } from "@/lib/finance/aggregates";
import { CurrencyBadge, CurrencyHint } from "@/components/ui/currency-badge";
import type { NetWorthBreakdown, NetWorthHistoryPoint } from "@/lib/finance/net-worth";
import type { Asset, AssetKind, Currency } from "@/lib/types/database";
import {
  INVESTMENT_SUBTYPES,
  LIABILITY_SUBTYPES,
  OTHER_ASSET_SUBTYPES,
  PROPERTY_SUBTYPES,
} from "@/lib/types/database";
import { brandClasses } from "@/lib/brand";
import { COLORS } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface NetWorthClientProps {
  breakdown: NetWorthBreakdown;
  history: NetWorthHistoryPoint[];
  assets: Asset[];
  defaultCurrency: Currency;
  convertedBalances: Record<string, number>;
}

function subtypeLabel(kind: AssetKind, subtype: string): string {
  const lists = {
    investment: INVESTMENT_SUBTYPES,
    property: PROPERTY_SUBTYPES,
    other: OTHER_ASSET_SUBTYPES,
    liability: LIABILITY_SUBTYPES,
  };
  return lists[kind].find((s) => s.value === subtype)?.label ?? subtype;
}

const KIND_LABELS: Record<AssetKind, string> = {
  investment: "Investments",
  property: "Property",
  other: "Other assets",
  liability: "Liabilities",
};

export function NetWorthClient({
  breakdown,
  history,
  assets,
  defaultCurrency,
  convertedBalances,
}: NetWorthClientProps) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const res = await fetch(`/api/assets?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Entry removed");
    router.refresh();
  }

  const nonInvestmentAssets = assets.filter((a) => a.kind !== "investment");
  const grouped: Record<AssetKind, Asset[]> = {
    investment: assets.filter((a) => a.kind === "investment"),
    property: assets.filter((a) => a.kind === "property"),
    other: assets.filter((a) => a.kind === "other"),
    liability: assets.filter((a) => a.kind === "liability"),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-light tracking-tight">Net worth</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your wealth over time, shown in <CurrencyHint code={defaultCurrency} className="inline-flex" />
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NetWorthEntryDialog
            defaultCurrency={defaultCurrency}
            onSaved={() => router.refresh()}
          />
        </div>
      </div>

      <EditorialCard title="Net worth today" index="HERO">
        <p className={`${brandClasses.mockSerifStat} text-foreground`}>
          {formatCurrencyPlain(breakdown.netWorth, defaultCurrency)}
        </p>
        {breakdown.totalDebt > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Includes {formatCurrencyPlain(breakdown.totalDebt, defaultCurrency)} in debt
          </p>
        )}
      </EditorialCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            { key: "investments", label: "Investments", value: breakdown.investments },
            { key: "property", label: "Property", value: breakdown.property },
            { key: "other", label: "Other", value: breakdown.other },
            { key: "liabilities", label: "Liabilities", value: breakdown.liabilities },
          ] as const
        ).map(({ key, label, value }, i) => (
          <EditorialCard key={key} title={label} index={`0${i + 1}`} variant="compact">
            <p className="font-mono text-lg">{formatCurrencyPlain(value, defaultCurrency)}</p>
            {key === "investments" && (
              <Link href="/investments" className="mt-1 text-xs text-accent hover:underline">
                Manage investments
              </Link>
            )}
            {key === "liabilities" && value > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">What you owe</p>
            )}
          </EditorialCard>
        ))}
      </div>

      <EditorialCard title="Net worth trend" index="TREND" subtitle="Last 12 months">
        {history.every((p) => p.netWorth === 0) ? (
          <p className="text-sm text-muted-foreground">
            Add assets to see your net worth over time.
          </p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={history} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) =>
                    formatCurrencyPlain(Number(v), defaultCurrency).replace(/\.\d{2}$/, "")
                  }
                  width={72}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrencyPlain(Number(value), defaultCurrency),
                    name === "netWorth" ? "Net worth" : String(name),
                  ]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="assets"
                  name="Assets"
                  fill={COLORS.mint}
                  radius={[4, 4, 0, 0]}
                  opacity={0.4}
                />
                <Line
                  type="monotone"
                  dataKey="netWorth"
                  name="Net worth"
                  stroke={COLORS.forest}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </EditorialCard>

      {assets.length === 0 ? (
        <EditorialCard title="Get started" index="START">
          <p className="text-sm text-muted-foreground">
            Add assets or liabilities to track your net worth.{" "}
            <Link href="/investments" className="text-accent hover:underline">
              Add investments
            </Link>
          </p>
        </EditorialCard>
      ) : (
        (["property", "other", "liability"] as AssetKind[]).map((kind) => {
          const items = grouped[kind];
          if (items.length === 0) return null;
          return (
            <EditorialCard
              key={kind}
              title={KIND_LABELS[kind]}
              index={kind === "liability" ? "DEBT" : kind.toUpperCase()}
              subtitle={`${items.length} items`}
              headerAction={
                kind === "liability" ? (
                  <NetWorthEntryDialog
                    defaultCurrency={defaultCurrency}
                    defaultEntryType="liability"
                    onSaved={() => router.refresh()}
                    trigger={<Button variant="outline" size="sm">Add liability</Button>}
                  />
                ) : undefined
              }
            >
              <div className="divide-y divide-border/60">
                {items.map((asset) => (
                  <EntryRow
                    key={asset.id}
                    asset={asset}
                    kind={kind}
                    defaultCurrency={defaultCurrency}
                    convertedBalance={convertedBalances[asset.id] ?? 0}
                    onDelete={handleDelete}
                    onSaved={() => router.refresh()}
                  />
                ))}
              </div>
            </EditorialCard>
          );
        })
      )}

      {grouped.investment.length > 0 && nonInvestmentAssets.length === 0 && (
        <EditorialCard title="Investments" index="INV">
          <p className="text-sm text-muted-foreground">
            You have {grouped.investment.length} investment
            {grouped.investment.length === 1 ? "" : "s"} tracked.{" "}
            <Link href="/investments" className="text-accent hover:underline">
              View all
            </Link>
          </p>
        </EditorialCard>
      )}
    </div>
  );
}

function EntryRow({
  asset,
  kind,
  defaultCurrency,
  convertedBalance,
  onDelete,
  onSaved,
}: {
  asset: Asset;
  kind: AssetKind;
  defaultCurrency: Currency;
  convertedBalance: number;
  onDelete: (id: string) => void;
  onSaved: () => void;
}) {
  const isLiability = kind === "liability";

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{asset.name}</p>
        <p className="text-xs text-muted-foreground">
          {subtypeLabel(kind, asset.subtype)}
          {!isLiability && Number(asset.debt) > 0
            ? ` · debt ${formatCurrencyPlain(Number(asset.debt), asset.currency as Currency)}`
            : ""}
          {" · "}
          as of {asset.as_of_date}
        </p>
      </div>
      <div className="text-right">
        <p className={cn("font-mono text-sm", isLiability && "text-destructive")}>
          {isLiability ? "−" : ""}
          {formatCurrencyPlain(convertedBalance, defaultCurrency)}
        </p>
        {asset.currency !== defaultCurrency && (
          <p className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
            <CurrencyBadge code={asset.currency} />
            {formatCurrencyPlain(
              isLiability ? Number(asset.value) : Number(asset.value) - Number(asset.debt),
              asset.currency as Currency
            )}
          </p>
        )}
      </div>
      <div className="flex gap-1">
        {isLiability ? (
          <NetWorthEntryDialog
            asset={asset}
            defaultCurrency={defaultCurrency}
            onSaved={onSaved}
            trigger={
              <Button variant="ghost" size="icon-sm">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
          />
        ) : (
          <NetWorthEntryDialog
            asset={asset}
            defaultCurrency={defaultCurrency}
            onSaved={onSaved}
            trigger={
              <Button variant="ghost" size="icon-sm">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
          />
        )}
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="ghost" size="icon-sm" className="text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {asset.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the {isLiability ? "liability" : "asset"} from your net worth
                history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(asset.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
