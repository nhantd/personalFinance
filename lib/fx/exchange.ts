import { createAdminClient } from "@/lib/supabase/admin";
import type { Currency } from "@/lib/types/database";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

interface OpenErApiResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
}

interface FrankfurterResponse {
  rates: Record<string, number>;
}

async function fetchRatesFromOpenErApi(base: string): Promise<Record<string, number>> {
  const res = await fetch(`https://open.er-api.com/v6/latest/${base.toUpperCase()}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`open.er-api.com failed: ${res.status}`);
  const data = (await res.json()) as OpenErApiResponse;
  if (data.result !== "success") throw new Error("open.er-api.com returned error");
  return data.rates;
}

async function fetchRatesFromFrankfurter(base: string): Promise<Record<string, number>> {
  const res = await fetch(
    `https://api.frankfurter.app/latest?from=${base.toUpperCase()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`frankfurter failed: ${res.status}`);
  const data = (await res.json()) as FrankfurterResponse;
  return { [base.toUpperCase()]: 1, ...data.rates };
}

export async function fetchRates(base: string): Promise<Record<string, number>> {
  try {
    return await fetchRatesFromOpenErApi(base);
  } catch {
    return fetchRatesFromFrankfurter(base);
  }
}

async function getCachedRate(
  from: string,
  to: string,
  rateDate: string
): Promise<number | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("fx_rates")
    .select("rate, fetched_at")
    .eq("base_currency", from.toUpperCase())
    .eq("quote_currency", to.toUpperCase())
    .eq("rate_date", rateDate)
    .maybeSingle();

  if (!data) return null;

  const age = Date.now() - new Date(data.fetched_at).getTime();
  if (age > CACHE_TTL_MS) return null;

  return Number(data.rate);
}

async function cacheRates(
  base: string,
  rates: Record<string, number>,
  rateDate: string
): Promise<void> {
  const admin = createAdminClient();
  const baseUpper = base.toUpperCase();
  const rows = Object.entries(rates).map(([quote, rate]) => ({
    base_currency: baseUpper,
    quote_currency: quote.toUpperCase(),
    rate,
    rate_date: rateDate,
    fetched_at: new Date().toISOString(),
  }));

  if (rows.length === 0) return;

  await admin.from("fx_rates").upsert(rows, {
    onConflict: "base_currency,quote_currency,rate_date",
  });
}

export async function getRate(
  from: Currency,
  to: Currency,
  _date?: string
): Promise<number> {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  if (fromUpper === toUpper) return 1;

  const rateDate = todayDate();

  const direct = await getCachedRate(fromUpper, toUpper, rateDate);
  if (direct !== null) return direct;

  const inverse = await getCachedRate(toUpper, fromUpper, rateDate);
  if (inverse !== null && inverse !== 0) return 1 / inverse;

  try {
    const rates = await fetchRates(fromUpper);
    await cacheRates(fromUpper, rates, rateDate);
    const rate = rates[toUpper];
    if (rate !== undefined) return rate;
  } catch {
    // try inverse base below
  }

  try {
    const rates = await fetchRates(toUpper);
    await cacheRates(toUpper, rates, rateDate);
    const rate = rates[fromUpper];
    if (rate !== undefined && rate !== 0) return 1 / rate;
  } catch {
    // fall through to USD cross
  }

  if (fromUpper !== "USD" && toUpper !== "USD") {
    const [fromUsd, toUsd] = await Promise.all([
      getRate(fromUpper as Currency, "USD"),
      getRate("USD", toUpper as Currency),
    ]);
    return fromUsd * toUsd;
  }

  throw new Error(`No FX rate for ${fromUpper} → ${toUpper}`);
}

export async function convertAmount(
  amount: number,
  from: Currency,
  to: Currency,
  date?: string
): Promise<number> {
  const rate = await getRate(from, to, date);
  return amount * rate;
}

export async function convertAmounts(
  items: { amount: number; currency: Currency }[],
  to: Currency
): Promise<number> {
  let total = 0;
  for (const item of items) {
    total += await convertAmount(item.amount, item.currency, to);
  }
  return total;
}

/** Client-side sync conversion when rates map is preloaded */
export function convertWithRates(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
  base: string
): number {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  if (fromUpper === toUpper) return amount;

  const baseUpper = base.toUpperCase();

  if (fromUpper === baseUpper) {
    const rate = rates[toUpper];
    return rate !== undefined ? amount * rate : amount;
  }

  if (toUpper === baseUpper) {
    const rate = rates[fromUpper];
    return rate !== undefined ? amount / rate : amount;
  }

  const fromRate = rates[fromUpper];
  const toRate = rates[toUpper];
  if (fromRate !== undefined && toRate !== undefined) {
    return (amount / fromRate) * toRate;
  }

  if (fromRate !== undefined && toUpper === baseUpper) {
    return amount / fromRate;
  }

  if (toRate !== undefined && fromUpper === baseUpper) {
    return amount * toRate;
  }

  return amount;
}

export async function preloadRatesForCurrencies(
  currencies: string[],
  base: Currency
): Promise<Record<string, number>> {
  const unique = [...new Set(currencies.map((c) => c.toUpperCase()))];
  if (unique.length === 0) return { [base.toUpperCase()]: 1 };

  const rates = await fetchRates(base);
  await cacheRates(base, rates, todayDate());
  return { [base.toUpperCase()]: 1, ...rates };
}
