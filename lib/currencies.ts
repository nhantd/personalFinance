export type CurrencyRegion =
  | "popular"
  | "americas"
  | "europe"
  | "asia_pacific"
  | "middle_east_africa";

export interface CurrencyMeta {
  code: string;
  name: string;
  symbol: string;
  region: CurrencyRegion;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", name: "US Dollar", symbol: "$", region: "popular" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "popular" },
  { code: "EUR", name: "Euro", symbol: "€", region: "popular" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", region: "popular" },

  { code: "CAD", name: "Canadian Dollar", symbol: "C$", region: "americas" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", region: "americas" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", region: "americas" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", region: "americas" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", region: "americas" },
  { code: "COP", name: "Colombian Peso", symbol: "$", region: "americas" },

  { code: "CHF", name: "Swiss Franc", symbol: "Fr", region: "europe" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", region: "europe" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", region: "europe" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", region: "europe" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", region: "europe" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", region: "europe" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", region: "europe" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", region: "europe" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", region: "europe" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", region: "europe" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", region: "europe" },

  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "asia_pacific" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: "asia_pacific" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", region: "asia_pacific" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", region: "asia_pacific" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", region: "asia_pacific" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", region: "asia_pacific" },
  { code: "THB", name: "Thai Baht", symbol: "฿", region: "asia_pacific" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", region: "asia_pacific" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", region: "asia_pacific" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", region: "asia_pacific" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: "asia_pacific" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "asia_pacific" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", region: "asia_pacific" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", region: "asia_pacific" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", region: "asia_pacific" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", region: "asia_pacific" },

  { code: "AED", name: "UAE Dirham", symbol: "د.إ", region: "middle_east_africa" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", region: "middle_east_africa" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", region: "middle_east_africa" },
  { code: "ZAR", name: "South African Rand", symbol: "R", region: "middle_east_africa" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", region: "middle_east_africa" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: "middle_east_africa" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: "middle_east_africa" },
];

const REGION_LABELS: Record<CurrencyRegion, string> = {
  popular: "Popular",
  americas: "Americas",
  europe: "Europe",
  asia_pacific: "Asia–Pacific",
  middle_east_africa: "Middle East & Africa",
};

const REGION_ORDER: CurrencyRegion[] = [
  "popular",
  "americas",
  "europe",
  "asia_pacific",
  "middle_east_africa",
];

const currencyByCode = new Map(CURRENCIES.map((c) => [c.code, c]));

export const SUPPORTED_CURRENCIES = CURRENCIES.map((c) => ({
  code: c.code,
  label: `${c.code} — ${c.name} (${c.symbol})`,
}));

export const SUPPORTED_CURRENCY_CODES = new Set(CURRENCIES.map((c) => c.code));

export function getCurrencyMeta(code: string): CurrencyMeta | undefined {
  return currencyByCode.get(code.toUpperCase());
}

export function getCurrencyLabel(code: string): string {
  const meta = getCurrencyMeta(code);
  if (!meta) return code.toUpperCase();
  return `${meta.code} · ${meta.name}`;
}

export function isSupportedCurrency(code: string): boolean {
  return SUPPORTED_CURRENCY_CODES.has(code.toUpperCase());
}

export function currencySelectItems() {
  return CURRENCIES.map((c) => ({
    value: c.code,
    label: `${c.code} · ${c.name}`,
  }));
}

export interface CurrencyGroup {
  label: string;
  currencies: CurrencyMeta[];
}

export function getCurrencyGroups(filter?: string): CurrencyGroup[] {
  const q = filter?.trim().toLowerCase() ?? "";

  return REGION_ORDER.map((region) => {
    const currencies = CURRENCIES.filter((c) => {
      if (c.region !== region) return false;
      if (!q) return true;
      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
      );
    });
    return { label: REGION_LABELS[region], currencies };
  }).filter((g) => g.currencies.length > 0);
}

/** @deprecated use CURRENCIES */
export interface CurrencyOption {
  code: string;
  label: string;
}

export type { CurrencyMeta as CurrencyOptionMeta };
