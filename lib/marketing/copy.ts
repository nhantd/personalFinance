import { BRAND } from "@/lib/brand";

export const MARKETING_COPY = {
  hero: {
    eyebrow: "No bank login · ever",
    headline: "Don't guess your finances.",
    headlineAccent: "Know every cent.",
    subline:
      "Upload a bank statement CSV or PDF. Monae categorizes every transaction and shows income, spending, and surplus — no bank login.",
    ctaHelper: "Privacy-first · your credentials stay with your bank",
  },
  features: {
    label: "Features",
    heading: "See your money clearly",
    subline: "Dashboards and charts built from your statements — not generic budgeting templates.",
  },
  howItWorks: {
    label: "How it works",
    heading: "From upload to answers in three steps",
    subline: "Download a statement from your bank, upload it, and ask questions in plain English.",
    steps: [
      {
        title: "Upload a statement",
        description:
          "Download CSV or PDF from any bank and drop it in. Your credentials never leave your bank.",
      },
      {
        title: "We categorize every line",
        description:
          "Every transaction is parsed and tagged — income, groceries, subscriptions, and more in seconds.",
      },
      {
        title: "Ask Monae anything",
        description:
          "Query your real numbers in plain language. Answers grounded in your data, not generic advice.",
      },
    ],
  },
  featureItems: [
    {
      id: "spending",
      title: "Spending intelligence",
      description:
        "Category breakdowns, recurring charge detection, and month-over-month trends — computed from your statements.",
    },
    {
      id: "budget",
      title: "Financial snapshot",
      description:
        "Income, outflows, and surplus at a glance. Know where you stand before the month ends.",
    },
    {
      id: "ask",
      title: "Ask Monae",
      description:
        "Natural language queries over your real data. How much on subscriptions? Can I afford the trip?",
    },
    {
      id: "privacy",
      title: "Privacy by architecture",
      description:
        "Your data stays yours — encrypted at rest, row-level security, and a one-click wipe whenever you want.",
    },
  ],
  preFooter: {
    headline: "Grow your wealth with clarity,",
    headlineAccent: "today.",
    subline:
      "Completely free. Drop a CSV and Monae categorizes it — first insights in about three minutes.",
    ctaHelper: "No card · No bank login",
    stats: [
      { label: "Setup time", value: "3–5 min" },
      { label: "Price", value: "$0.00", highlight: true },
    ],
  },
  auth: {
    tagline: "Know every cent of your finances.",
    taglineAccent: "decoded.",
  },
  metadata: {
    title: `${BRAND.name} — Know every cent of your finances`,
    description:
      "Upload bank statements, get categorized spending insights, surplus tracking, and plain-English answers — no bank login ever.",
  },
  footer: {
    tagline: "AI personal finance platform, built for how Americans actually manage money.",
    bottomBar: `${BRAND.name} — every cent of your finances, decoded`,
  },
} as const;
