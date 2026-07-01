import { BRAND } from "@/lib/brand";

export const MARKETING_COPY = {
  hero: {
    eyebrow: "No bank credentials · ever",
    headline: "See your whole financial picture.",
    headlineAccent: "Not just your spending.",
    subline:
      "Upload bank statements, track net worth, liabilities, investments, and property — without sharing bank credentials or account details.",
    ctaHelper: "Privacy-first · your credentials never leave your bank",
  },
  wealth: {
    label: "Wealth",
    heading: "Every asset. Every debt. One clear picture.",
    subline:
      "Net worth, investments, property, and liabilities in one view. Cash flow from your statements, everything else you add manually — no bank connection required.",
    pillars: [
      {
        id: "net-worth",
        title: "Net worth",
        subtitle: "Total assets minus liabilities",
        value: "$142,400",
        detail: "+4.2% vs last month",
      },
      {
        id: "investments",
        title: "Investments",
        subtitle: "Stocks, savings, liquid assets",
        value: "$68,200",
        detail: "Across 3 holdings",
      },
      {
        id: "property",
        title: "Property",
        subtitle: "Home equity and real estate",
        value: "$38,000",
        detail: "$210k value · $172k mortgage",
      },
      {
        id: "liabilities",
        title: "Liabilities",
        subtitle: "Credit cards, loans, mortgages",
        value: "$38,600",
        detail: "Total debt tracked",
      },
    ],
  },
  features: {
    label: "Features",
    heading: "Cash flow and wealth, together",
    subline:
      "Statements power your spending insights. Manual entries complete the picture for investments, property, and debt.",
  },
  howItWorks: {
    label: "How it works",
    heading: "From upload to answers in three steps",
    subline:
      "Download a statement from your bank, upload it, and ask questions in plain English.",
    steps: [
      {
        index: "01",
        title: "Upload",
        description:
          "Drop a CSV or PDF from any bank — no credentials or account details required.",
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
      id: "net-worth",
      title: "Net worth",
      subtitle: "Assets, liabilities, and wealth over time",
    },
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
      "What's my net worth right now?",
      "How much debt do I have across all liabilities?",
      "What's my largest spending category this month?",
      "Am I ahead or behind this month?",
    ],
    examples: [
      {
        question: "What's my net worth right now?",
        answerLead: "Net worth is",
        answerHighlight: "$142,400",
        answerTail: " — $181,000 in assets minus $38,600 in liabilities.",
      },
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
    ],
  },
  comparison: {
    label: "Compare",
    heading: "How Monae compares",
    subline:
      "Most finance apps need Open Banking. Monae doesn't — upload statements, track wealth your way, and ask AI questions from your real numbers.",
    columns: ["Monae", "Lumio", "Emma"] as const,
    rows: [
      {
        feature: "Bank connection required",
        monae: "No — upload CSV/PDF",
        lumio: "Yes — Open Banking",
        emma: "Yes — Open Banking",
        monaeWins: true,
      },
      {
        feature: "Bank credentials shared",
        monae: "Never",
        lumio: "OAuth via your bank",
        emma: "OAuth via your bank",
        monaeWins: true,
      },
      {
        feature: "Setup time",
        monae: "~1 minute",
        lumio: "Connect multiple accounts",
        emma: "Connect accounts first",
        monaeWins: true,
      },
      {
        feature: "Net worth tracking",
        monae: "Yes — manual or automated",
        lumio: "Yes — Open Banking sync",
        emma: "Yes — paid tiers",
        monaeWins: true,
      },
      {
        feature: "AI Q&A from your data",
        monae: "Yes",
        lumio: "Limited",
        emma: "Limited",
        monaeWins: true,
      },
      {
        feature: "Price",
        monae: "Free (beta)",
        lumio: "Free + paid plans",
        emma: "Free + paid plans",
        monaeWins: true,
      },
    ],
  },
  faq: {
    label: "FAQ",
    heading: "Common questions",
    subline: "Quick answers about how Monae works.",
    items: [
      {
        question: "Do I need to connect my bank account to use Monae?",
        answer:
          "No. Monae works by uploading bank statements as CSV or PDF files. You never share bank credentials, account numbers, or Open Banking access. Download a statement from your bank's website and upload it to Monae.",
      },
      {
        question: "Can Monae track my net worth and liabilities?",
        answer:
          "Yes. Add investments, property, and other assets manually, plus liabilities like credit cards, student loans, and mortgages. Monae calculates your net worth and shows trends over time, alongside cash-flow insights from your statements.",
      },
      {
        question: "What file formats does Monae support?",
        answer:
          "Monae accepts CSV and PDF bank statements from any bank. Upload checking, savings, or credit card statements — Monae parses transactions and categorizes them automatically.",
      },
      {
        question: "Is Monae free?",
        answer:
          "Monae is completely free while in beta. There is no credit card required and no paid tiers. Upload statements, track your wealth, and ask questions at no cost during the beta period.",
      },
      {
        question: "How is Monae different from Emma or Lumio?",
        answer:
          "Emma and Lumio connect to your bank via Open Banking and auto-sync transactions. Monae never requires a bank connection — you upload statements and add wealth entries yourself. That means faster setup, no credentials shared, and full control over what data enters the app.",
      },
      {
        question: "Can I delete all my data?",
        answer:
          "Yes. Monae lets you delete everything — statements, transactions, net worth entries, and chat history — with one click in Settings. Your data is encrypted at rest and never sold.",
      },
    ],
  },
  preFooter: {
    headline: "Grow your wealth with clarity,",
    headlineAccent: "today.",
    subline:
      "Completely free while in beta. Upload a statement and see your first insights in about one minute.",
    ctaHelper: "No card · No bank credentials",
    stats: [
      { label: "Setup time", value: "~1 min" },
      { label: "Price", value: "$0.00", highlight: true, sublabel: "In beta" },
      { label: "Bank credentials", value: "Never required" },
    ],
  },
  privacy: {
    tagline: "No Open Banking · No API keys · No screen-scraping · Ever",
  },
  auth: {
    tagline: "Know every cent of your finances.",
    taglineAccent: "clarified.",
    bottomBar: `${BRAND.name} — your statements, clarified`,
    credentialBadge: "No bank credentials · ever",
  },
  metadata: {
    title: `${BRAND.name} — AI Personal Finance Advisor | No Bank Credentials`,
    description:
      "Your AI personal finance advisor — ask about spending, net worth, and debt from uploaded bank statements. No bank credentials, no Open Banking. Free while in beta. Insights, not advice.",
    keywords: [
      "AI personal finance advisor",
      "AI money advisor",
      "net worth tracker",
      "personal finance app",
      "wealth tracker",
      "liability tracker",
      "no bank login finance app",
      "statement upload budget",
      "CSV PDF bank statement",
      "privacy first finance",
      "alternative to Emma",
      "alternative to Lumio",
      "manual net worth tracker",
      "AI finance assistant",
    ],
  },
  footer: {
    tagline:
      "Privacy-first wealth and spending tracker — built for people who won't hand over bank credentials.",
    bottomBar: `${BRAND.name} — your statements, clarified`,
  },
} as const;
