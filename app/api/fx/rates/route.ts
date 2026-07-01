import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchRates, preloadRatesForCurrencies } from "@/lib/fx/exchange";
import type { Currency } from "@/lib/types/database";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("base") ?? "USD").toUpperCase();
  const currenciesParam = searchParams.get("currencies");

  try {
    if (currenciesParam) {
      const currencies = currenciesParam.split(",").filter(Boolean);
      const rates = await preloadRatesForCurrencies(currencies, base as Currency);
      return NextResponse.json({ base, rates });
    }

    const rates = await fetchRates(base);
    return NextResponse.json({ base, rates });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch rates";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
