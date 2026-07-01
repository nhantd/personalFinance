export type Currency =
  | "USD"
  | "GBP"
  | "EUR"
  | "VND"
  | "CAD"
  | "MXN"
  | "BRL"
  | "ARS"
  | "CLP"
  | "COP"
  | "CHF"
  | "SEK"
  | "NOK"
  | "DKK"
  | "PLN"
  | "CZK"
  | "HUF"
  | "RON"
  | "TRY"
  | "UAH"
  | "RUB"
  | "JPY"
  | "CNY"
  | "HKD"
  | "SGD"
  | "KRW"
  | "TWD"
  | "THB"
  | "MYR"
  | "IDR"
  | "PHP"
  | "INR"
  | "AUD"
  | "NZD"
  | "PKR"
  | "BDT"
  | "LKR"
  | "AED"
  | "SAR"
  | "ILS"
  | "ZAR"
  | "EGP"
  | "NGN"
  | "KES"
  | (string & {});

export { SUPPORTED_CURRENCIES, isSupportedCurrency, currencySelectItems } from "@/lib/currencies";
export type { CurrencyOption } from "@/lib/currencies";

export type AssetKind = "investment" | "property" | "other" | "liability";

export type InvestmentSubtype = "stocks" | "savings" | "other_liquid";
export type PropertySubtype = "house" | "other_property";
export type OtherAssetSubtype = "vehicle" | "other";
export type LiabilitySubtype =
  | "credit_card"
  | "student_loan"
  | "personal_loan"
  | "mortgage"
  | "hecs"
  | "other";

export type StatementStatus = "pending" | "processing" | "complete" | "failed";

export type FileType = "csv" | "pdf";

export interface Profile {
  id: string;
  display_name: string | null;
  default_currency: Currency;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  institution: string | null;
  currency: Currency;
  current_balance: number | null;
  balance_as_of: string | null;
  created_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  kind: AssetKind;
  subtype: string;
  name: string;
  currency: Currency;
  value: number;
  debt: number;
  institution: string | null;
  notes: string | null;
  as_of_date: string;
  created_at: string;
  updated_at: string;
}

export interface AssetSnapshot {
  id: string;
  asset_id: string;
  user_id: string;
  recorded_at: string;
  value: number;
  debt: number;
  currency: Currency;
}

export interface FxRate {
  base_currency: string;
  quote_currency: string;
  rate: number;
  rate_date: string;
  fetched_at: string;
}

export interface Statement {
  id: string;
  user_id: string;
  account_id: string;
  file_path: string;
  file_type: FileType;
  status: StatementStatus;
  period_start: string | null;
  period_end: string | null;
  parsed_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  statement_id: string;
  date: string;
  description: string;
  amount: number;
  currency: Currency;
  category: string;
  is_income: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  slug: string;
  label: string;
  icon: string | null;
  is_system: boolean;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  is_income: boolean;
  category?: string;
}

export const INVESTMENT_SUBTYPES: { value: InvestmentSubtype; label: string }[] = [
  { value: "stocks", label: "Stocks & shares" },
  { value: "savings", label: "Savings" },
  { value: "other_liquid", label: "Other liquid" },
];

export const PROPERTY_SUBTYPES: { value: PropertySubtype; label: string }[] = [
  { value: "house", label: "House / home" },
  { value: "other_property", label: "Other property" },
];

export const OTHER_ASSET_SUBTYPES: { value: OtherAssetSubtype; label: string }[] = [
  { value: "vehicle", label: "Vehicle" },
  { value: "other", label: "Other" },
];

export const LIABILITY_SUBTYPES: { value: LiabilitySubtype; label: string }[] = [
  { value: "credit_card", label: "Credit card" },
  { value: "student_loan", label: "Student loan" },
  { value: "personal_loan", label: "Personal loan" },
  { value: "mortgage", label: "Mortgage" },
  { value: "hecs", label: "HECS / HELP" },
  { value: "other", label: "Other" },
];

export const NET_WORTH_ASSET_CATEGORIES: {
  value: PropertySubtype | OtherAssetSubtype;
  label: string;
  kind: "property" | "other";
}[] = [
  ...PROPERTY_SUBTYPES.map((s) => ({ ...s, kind: "property" as const })),
  ...OTHER_ASSET_SUBTYPES.map((s) => ({ ...s, kind: "other" as const })),
];

export const SYSTEM_CATEGORIES = [
  { slug: "income", label: "Income", icon: "wallet" },
  { slug: "rent-housing", label: "Rent/Housing", icon: "home" },
  { slug: "groceries", label: "Groceries", icon: "shopping-cart" },
  { slug: "transport", label: "Transport", icon: "car" },
  { slug: "subscriptions", label: "Subscriptions", icon: "repeat" },
  { slug: "dining", label: "Dining", icon: "utensils" },
  { slug: "shopping", label: "Shopping", icon: "bag" },
  { slug: "utilities", label: "Utilities", icon: "zap" },
  { slug: "transfer", label: "Transfer", icon: "arrow-left-right" },
  { slug: "loan", label: "Loan", icon: "landmark" },
  { slug: "other", label: "Other", icon: "circle" },
] as const;

export type CategorySlug = (typeof SYSTEM_CATEGORIES)[number]["slug"];
