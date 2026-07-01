import type { Asset, AssetSnapshot, AssetKind, Currency } from "@/lib/types/database";
import { type FxContext, toBaseCurrency } from "@/lib/finance/fx-context";

export interface NetWorthBreakdown {
  investments: number;
  property: number;
  other: number;
  liabilities: number;
  totalDebt: number;
  netWorth: number;
}

export interface NetWorthHistoryPoint {
  monthKey: string;
  label: string;
  netWorth: number;
  assets: number;
  debt: number;
}

export function computeCurrentNetWorth(
  assets: Asset[],
  fx: FxContext
): NetWorthBreakdown {
  let investments = 0;
  let property = 0;
  let other = 0;
  let liabilities = 0;
  let totalDebt = 0;

  for (const asset of assets) {
    const currency = asset.currency as Currency;

    if (asset.kind === "liability") {
      const owed = toBaseCurrency(Number(asset.value), currency, fx);
      liabilities += owed;
      totalDebt += owed;
      continue;
    }

    const equity = Number(asset.value) - Number(asset.debt);
    const convertedEquity = toBaseCurrency(equity, currency, fx);
    const convertedDebt = toBaseCurrency(Number(asset.debt), currency, fx);
    totalDebt += convertedDebt;

    if (asset.kind === "investment") investments += convertedEquity;
    else if (asset.kind === "property") property += convertedEquity;
    else other += convertedEquity;
  }

  return {
    investments,
    property,
    other,
    liabilities,
    totalDebt,
    netWorth: investments + property + other - liabilities,
  };
}

function monthEndKeys(months: number): { monthKey: string; label: string; endDate: string }[] {
  const now = new Date();
  const keys: { monthKey: string; label: string; endDate: string }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${monthKey}-${String(lastDay).padStart(2, "0")}`;
    keys.push({
      monthKey,
      label: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      endDate,
    });
  }

  return keys;
}

export function computeNetWorthHistory(
  assets: Asset[],
  snapshots: AssetSnapshot[],
  fx: FxContext,
  months = 12
): NetWorthHistoryPoint[] {
  const monthKeys = monthEndKeys(months);

  const snapshotsByAsset = new Map<string, AssetSnapshot[]>();
  for (const snap of snapshots) {
    const list = snapshotsByAsset.get(snap.asset_id) ?? [];
    list.push(snap);
    snapshotsByAsset.set(snap.asset_id, list);
  }

  for (const [, list] of snapshotsByAsset) {
    list.sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));
  }

  const points: NetWorthHistoryPoint[] = [];

  for (const { monthKey, label, endDate } of monthKeys) {
    let totalAssets = 0;
    let totalDebt = 0;

    for (const asset of assets) {
      const assetSnaps = snapshotsByAsset.get(asset.id) ?? [];
      let snap: AssetSnapshot | Asset | null = null;

      for (const s of assetSnaps) {
        if (s.recorded_at <= endDate) snap = s;
        else break;
      }

      if (!snap) {
        if (asset.as_of_date <= endDate) snap = asset;
        else continue;
      }

      const value = Number(snap.value);
      const debt = Number(snap.debt);
      const currency = snap.currency as Currency;

      if (asset.kind === "liability") {
        totalDebt += toBaseCurrency(value, currency, fx);
      } else {
        totalAssets += toBaseCurrency(value, currency, fx);
        totalDebt += toBaseCurrency(debt, currency, fx);
      }
    }

    points.push({
      monthKey,
      label,
      netWorth: totalAssets - totalDebt,
      assets: totalAssets,
      debt: totalDebt,
    });
  }

  return points;
}

export function groupAssetsByKind(assets: Asset[]): Record<AssetKind, Asset[]> {
  return {
    investment: assets.filter((a) => a.kind === "investment"),
    property: assets.filter((a) => a.kind === "property"),
    other: assets.filter((a) => a.kind === "other"),
    liability: assets.filter((a) => a.kind === "liability"),
  };
}

export function computeAssetEquity(asset: Asset, fx: FxContext): number {
  const currency = asset.currency as Currency;

  if (asset.kind === "liability") {
    return -toBaseCurrency(Number(asset.value), currency, fx);
  }

  const equity = Number(asset.value) - Number(asset.debt);
  return toBaseCurrency(equity, currency, fx);
}

export function computeLiabilityBalance(asset: Asset, fx: FxContext): number {
  return toBaseCurrency(Number(asset.value), asset.currency as Currency, fx);
}

export function collectAssetCurrencies(assets: Asset[]): string[] {
  return assets.map((a) => a.currency);
}
