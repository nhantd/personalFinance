export type TagType = "subscription" | "goal" | "loan" | "default";

export const MOCK_STATEMENT = {
  filename: "STATEMENT.CSV",
  accountLabel: "CHASE CHECKING",
} as const;

export const MOCK_UPLOAD_FILE = "wells-fargo-checking-may.csv" as const;

export const MOCK_TRANSACTIONS = [
  {
    date: "03 JUN",
    desc: "TRADER JOE'S",
    cat: "Groceries",
    amount: "−$38.42",
    tagType: "default" as TagType,
  },
  {
    date: "03 JUN",
    desc: "LYFT",
    cat: "Transport",
    amount: "−$11.20",
    tagType: "default" as TagType,
  },
  {
    date: "02 JUN",
    desc: "DISNEY+",
    cat: "Streaming",
    amount: "−$13.99",
    tagType: "subscription" as TagType,
    trendHighlight: true,
    trendLabel: "↑ 22% vs last month",
  },
  {
    date: "01 JUN",
    desc: "TRANSFER → EMERGENCY FUND",
    cat: "Goal ✓",
    amount: "+$400.00",
    tagType: "goal" as TagType,
    positive: true,
  },
  {
    date: "28 MAY",
    desc: "WELLS FARGO HOME MTG",
    cat: "Loan",
    amount: "−$1,920",
    tagType: "loan" as TagType,
  },
] as const;

export const MOCK_INSIGHT = {
  surplus: "$2,140",
  income: "$5.1k",
  outflows: "$3.0k",
  surplusFormatted: "+$2,140",
} as const;

export const MOCK_READ = {
  cashFlowPositive: "$2,140",
  month: "May",
  categoryUp: "Dining out",
  categoryChangePct: "22%",
  compareMonth: "April",
  goalName: "Emergency fund",
  goalPct: "31%",
} as const;

export const MOCK_CATEGORIES = [
  { name: "Housing", amount: 1920, pct: 38 },
  { name: "Groceries", amount: 348, pct: 19 },
  { name: "Transport", amount: 204, pct: 11 },
  { name: "Other", amount: 528, pct: 32 },
] as const;

export const MOCK_FLOW = {
  inflows: [
    { label: "Salary", pct: 88, color: "bg-soft" },
    { label: "Other", pct: 12, color: "bg-soft" },
  ],
  outflows: [
    { label: "Housing", pct: 38, color: "bg-chart-blue" },
    { label: "Groceries", pct: 19, color: "bg-chart-tan" },
    { label: "Transport", pct: 11, color: "bg-muted-foreground/40" },
    { label: "Other", pct: 32, color: "bg-soft/60" },
  ],
  insight: "Housing takes 38% of spending this month",
} as const;

export const MOCK_BUDGET = {
  income: "$5.1k/MO",
  categories: 14,
  budget: "$3.0k",
  surplus: "+$2,140",
  monthLabel: "MAY",
  actionLabel: "MAY READY TO CLOSE — ALLOCATE +$2,140 →",
} as const;

export const MOCK_ASK_FEATURE = {
  question: "What's my largest spending category this month?",
  answerLead: "Housing at",
  answerAmount: "$1,920",
  answerTail: ", then groceries at $348.",
} as const;

export const MOCK_ASK_STEP = {
  question: "Am I ahead or behind this month?",
  answer: "Ahead by $2,140 — income covers spending with room left over.",
} as const;

export const MOCK_STEP_TRANSACTIONS = MOCK_TRANSACTIONS.slice(0, 3);
