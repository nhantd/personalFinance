export const MOCK_TRANSACTIONS = [
  { date: "03 JUN", desc: "WHOLE FOODS", cat: "Groceries", amount: "−$42.18" },
  { date: "03 JUN", desc: "UBER TRIP", cat: "Transport", amount: "−$8.60" },
  { date: "02 JUN", desc: "NETFLIX.COM", cat: "Subscriptions", amount: "−$15.99", creep: true },
  { date: "01 JUN", desc: "TRANSFER → ROTH IRA", cat: "Goal ✓", amount: "+$500.00", positive: true },
  { date: "28 MAY", desc: "CHASE MORTGAGE", cat: "Loan", amount: "−$1,850" },
] as const;

export const MOCK_INSIGHT = {
  surplus: "$1,847",
  income: "$4.2k",
  outflows: "$2.4k",
  surplusFormatted: "+$1,847",
} as const;

export const MOCK_CATEGORIES = [
  { name: "Housing", amount: 1850, pct: 42 },
  { name: "Groceries", amount: 312, pct: 18 },
  { name: "Transport", amount: 186, pct: 12 },
  { name: "Subscriptions", amount: 127, pct: 8 },
] as const;
