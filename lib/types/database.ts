export type Currency = "GBP" | "USD" | "EUR";

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
  created_at: string;
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
