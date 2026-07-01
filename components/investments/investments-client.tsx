"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { EditorialCard } from "@/components/ui/editorial-card";
import { AssetFormDialog } from "@/components/assets/asset-form-dialog";
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
import type { Asset, Currency } from "@/lib/types/database";
import { INVESTMENT_SUBTYPES } from "@/lib/types/database";
import { brandClasses } from "@/lib/brand";

interface InvestmentsClientProps {
  assets: Asset[];
  defaultCurrency: Currency;
  convertedTotals: Record<string, number>;
  totalInvestments: number;
}

function subtypeLabel(subtype: string): string {
  return INVESTMENT_SUBTYPES.find((s) => s.value === subtype)?.label ?? subtype;
}

export function InvestmentsClient({
  assets,
  defaultCurrency,
  convertedTotals,
  totalInvestments,
}: InvestmentsClientProps) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const res = await fetch(`/api/assets?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Investment removed");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-light tracking-tight">Investments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stocks, savings, and other liquid assets
          </p>
        </div>
        <AssetFormDialog
          kind="investment"
          onSaved={() => router.refresh()}
          trigger={<Button className={brandClasses.btnPrimary}>Add investment</Button>}
        />
      </div>

      <EditorialCard title="Total investments" index="TOTAL">
        <p className={`${brandClasses.mockSerifStat} text-foreground`}>
          {formatCurrencyPlain(totalInvestments, defaultCurrency)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Totals converted to <CurrencyHint code={defaultCurrency} className="inline-flex" />
          {" · "}
          <Link href="/settings" className="text-accent hover:underline">
            change in settings
          </Link>
        </p>
      </EditorialCard>

      {assets.length === 0 ? (
        <EditorialCard title="No investments yet" index="EMPTY">
          <p className="text-sm text-muted-foreground">
            Add your stocks, savings accounts, or other liquid holdings to track them here and in
            net worth.
          </p>
        </EditorialCard>
      ) : (
        <EditorialCard title="Holdings" index="LIST" subtitle={`${assets.length} items`}>
          <div className="divide-y divide-border/60">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {subtypeLabel(asset.subtype)}
                    {asset.institution ? ` · ${asset.institution}` : ""}
                    {" · "}
                    as of {asset.as_of_date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">
                    {formatCurrencyPlain(convertedTotals[asset.id] ?? 0, defaultCurrency)}
                  </p>
                  {asset.currency !== defaultCurrency && (
                    <p className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
                      <CurrencyBadge code={asset.currency} />
                      {formatCurrencyPlain(Number(asset.value), asset.currency as Currency)}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <AssetFormDialog
                    kind="investment"
                    asset={asset}
                    onSaved={() => router.refresh()}
                    trigger={
                      <Button variant="ghost" size="icon-sm">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
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
                          This will remove the investment and its history from net worth.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(asset.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </EditorialCard>
      )}
    </div>
  );
}
