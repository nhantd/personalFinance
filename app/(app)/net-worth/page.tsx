import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { WealthPageSkeleton } from "@/components/skeletons/page-skeletons";
import { NetWorthClient } from "@/components/net-worth/net-worth-client";
import { createFxContext } from "@/lib/finance/fx-context";
import { getBaseCurrency, getUserProfile } from "@/lib/finance/profile";
import {
  collectAssetCurrencies,
  computeAssetEquity,
  computeCurrentNetWorth,
  computeLiabilityBalance,
  computeNetWorthHistory,
} from "@/lib/finance/net-worth";
import type { Asset, AssetSnapshot } from "@/lib/types/database";

export default async function NetWorthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await getUserProfile(supabase, user!.id);
  const baseCurrency = getBaseCurrency(profile);

  const [{ data: assets }, { data: snapshots }] = await Promise.all([
    supabase
      .from("assets")
      .select("*")
      .eq("user_id", user!.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("asset_snapshots")
      .select("*")
      .eq("user_id", user!.id)
      .order("recorded_at", { ascending: true }),
  ]);

  const assetList = (assets ?? []) as Asset[];
  const snapshotList = (snapshots ?? []) as AssetSnapshot[];

  const fx = await createFxContext(baseCurrency, collectAssetCurrencies(assetList));
  const breakdown = computeCurrentNetWorth(assetList, fx);
  const history = computeNetWorthHistory(assetList, snapshotList, fx);

  const convertedBalances: Record<string, number> = {};
  for (const asset of assetList) {
    convertedBalances[asset.id] =
      asset.kind === "liability"
        ? computeLiabilityBalance(asset, fx)
        : computeAssetEquity(asset, fx);
  }

  return (
    <Suspense fallback={<WealthPageSkeleton />}>
      <NetWorthClient
        breakdown={breakdown}
        history={history}
        assets={assetList}
        defaultCurrency={baseCurrency}
        convertedBalances={convertedBalances}
      />
    </Suspense>
  );
}
