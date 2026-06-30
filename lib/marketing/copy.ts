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
        index: "01",
        title: "Upload",
        description: "Drop a CSV or PDF from any bank — credentials stay with your bank.",
      },
      {
        index: "02",
        title: "Categorize",
        description: "Every line parsed and tagged in seconds.",
      },
      {
        index: "03",
        title: "Ask",
        description: "Plain-language answers from your real numbers.",
      },
    ],
  },
  featureItems: [
    {
      id: "spending",
      title: "Spending",
      subtitle: "Category breakdowns and month-over-month trends",
    },
    {
      id: "budget",
      title: "Budget",
      subtitle: "Income, spending, and cash left over",
    },
    {
      id: "ask",
      title: "Ask Monae",
      subtitle: "Plain-language answers from your statements",
    },
  ],
  askSection: {
    suggestedQuestions: [
      "What's my largest spending category this month?",
      "Am I ahead or behind this month?",
      "Where did most of my money go in May?",
    ],
    examples: [
      {
        question: "What's my largest spending category this month?",
        answerLead: "Housing at",
        answerHighlight: "$1,920",
        answerTail: ", then groceries at $348.",
      },
      {
        question: "Am I ahead or behind this month?",
        answerLead: "Ahead by",
        answerHighlight: "$2,140",
        answerTail: " — income covers spending with room left over.",
      },
      {
        question: "Where did most of my money go in May?",
        answerLead: "Housing took",
        answerHighlight: "38%",
        answerTail: " of outflows, followed by groceries at 19%.",
      },
    ],
  },
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
    taglineAccent: "clarified.",
    bottomBar: `${BRAND.name} — your statements, clarified`,
  },
  metadata: {
    title: `${BRAND.name} — Know every cent of your finances`,
    description:
      "Upload bank statements, get categorized spending insights, surplus tracking, and plain-English answers — no bank login ever.",
  },
  footer: {
    tagline: "AI personal finance platform, built for how Americans actually manage money.",
    bottomBar: `${BRAND.name} — your statements, clarified`,
  },
} as const;
