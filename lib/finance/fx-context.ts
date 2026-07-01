import { convertWithRates, preloadRatesForCurrencies } from "@/lib/fx/exchange";
import type { Currency } from "@/lib/types/database";

export interface FxContext {
  baseCurrency: Currency;
  rates: Record<string, number>;
}

export async function createFxContext(
  baseCurrency: Currency,
  sourceCurrencies: string[]
): Promise<FxContext> {
  const unique = [
    ...new Set(
      sourceCurrencies
        .map((c) => c.toUpperCase())
        .filter((c) => c && c !== baseCurrency.toUpperCase())
    ),
  ];

  let rates: Record<string, number> = { [baseCurrency.toUpperCase()]: 1 };

  if (unique.length > 0) {
    try {
      rates = await preloadRatesForCurrencies(unique, baseCurrency);
    } catch {
      rates = { [baseCurrency.toUpperCase()]: 1 };
    }
  }

  return { baseCurrency, rates };
}

export function toBaseCurrency(
  amount: number,
  from: Currency,
  ctx: FxContext
): number {
  return convertWithRates(
    amount,
    from,
    ctx.baseCurrency,
    ctx.rates,
    ctx.baseCurrency
  );
}
