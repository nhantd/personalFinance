import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { InvestmentsPageSkeleton } from "@/components/skeletons/page-skeletons";
import { InvestmentsClient } from "@/components/investments/investments-client";
import { createFxContext } from "@/lib/finance/fx-context";
import { getBaseCurrency, getUserProfile } from "@/lib/finance/profile";
import { collectAssetCurrencies, computeAssetEquity } from "@/lib/finance/net-worth";
import type { Asset } from "@/lib/types/database";

export default async function InvestmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await getUserProfile(supabase, user!.id);
  const baseCurrency = getBaseCurrency(profile);

  const { data: assets } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", user!.id)
    .eq("kind", "investment")
    .order("updated_at", { ascending: false });

  const list = (assets ?? []) as Asset[];
  const fx = await createFxContext(baseCurrency, collectAssetCurrencies(list));

  const convertedTotals: Record<string, number> = {};
  let totalInvestments = 0;

  for (const asset of list) {
    const equity = computeAssetEquity(asset, fx);
    convertedTotals[asset.id] = equity;
    totalInvestments += equity;
  }

  return (
    <Suspense fallback={<InvestmentsPageSkeleton />}>
      <InvestmentsClient
        assets={list}
        defaultCurrency={baseCurrency}
        convertedTotals={convertedTotals}
        totalInvestments={totalInvestments}
      />
    </Suspense>
  );
}
