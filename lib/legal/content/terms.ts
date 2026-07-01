import type { LegalDocumentMeta } from "@/lib/legal/types";

export const TERMS_DOCUMENT: LegalDocumentMeta = {
  slug: "terms",
  label: "TERMS OF SERVICE",
  title: "Terms of service.",
  description: "Terms governing your use of Monae.",
  sections: [
    {
      id: "introduction",
      title: "Introduction and acceptance",
      paragraphs: [
        "These Terms of Service (Terms) are a legally binding agreement between you and the operator of Monae (we, us, or our), governing your access to and use of our website, web application, and related products and services (collectively, the Services).",
        "By creating an account, accessing, or using the Services, you agree to these Terms and our Privacy Policy. If you do not agree, you must not use the Services.",
        "These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict-of-law principles.",
      ],
    },
    {
      id: "about",
      title: "About the Services",
      paragraphs: [
        "Monae is an AI-powered personal finance platform that may provide spending analysis, net worth and wealth tracking, statement parsing, categorization, and AI-generated insights based on data you upload.",
        "Monae is a data display and insights tool. It is not a bank, broker, lender, investment adviser, tax adviser, or credit provider. Monae does not execute transactions on your behalf and does not connect directly to your bank accounts.",
        "We may update, improve, suspend, remove, or change any part of the Services from time to time.",
      ],
    },
    {
      id: "no-advice",
      title: "No financial, legal, or tax advice",
      paragraphs: [
        "Monae is not a registered investment adviser, broker-dealer, or licensed financial professional unless expressly stated otherwise.",
        "Nothing on the Services constitutes financial product advice, investment advice, tax advice, credit advice, legal advice, or any other regulated professional advice. Information, outputs, insights, summaries, and analysis generated through the Services are provided for general informational purposes only and may be incomplete, inaccurate, delayed, or unsuitable for your circumstances.",
        "You are responsible for assessing any output before relying on it. You should obtain advice from appropriately qualified professionals before making financial, investment, credit, tax, legal, or business decisions.",
      ],
    },
    {
      id: "eligibility",
      title: "Eligibility",
      paragraphs: ["To use the Services, you must:"],
      bullets: [
        "be at least 18 years old;",
        "have the legal capacity to enter into a binding agreement under applicable law; and",
        "not be prohibited from accessing or using the Services under any applicable law.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts and registration",
      paragraphs: [
        "To access some or all of the Services, you may need to create an account. You agree to provide accurate information, keep your login credentials secure, notify us promptly at hello@monae.app if you suspect unauthorized access, and remain responsible for activity under your account except where caused by our breach of these Terms.",
        "We may refuse registration, suspend access, or require re-verification where reasonably necessary for security, fraud prevention, legal compliance, or to protect the integrity of the Services.",
      ],
    },
    {
      id: "beta-pricing",
      title: "Beta and pricing",
      paragraphs: [
        "Monae is currently offered free of charge while in beta. Features, usage limits, and availability may change without notice during this period.",
        "We may introduce paid plans in the future. If we do, we will provide reasonable notice before any paid subscription takes effect.",
      ],
    },
    {
      id: "your-data",
      title: "Your data",
      paragraphs: [
        "You retain ownership of the data, files, and information you upload or submit to the Services (Your Data).",
        "You grant us a non-exclusive, worldwide, royalty-free licence to host, copy, store, transmit, process, and use Your Data only as reasonably necessary to provide, maintain, secure, and improve the Services, comply with law, and prevent fraud or abuse.",
        "You are responsible for the accuracy, quality, legality, and reliability of Your Data and for ensuring you have all rights and permissions needed to provide it to us.",
        "Our handling of personal information is described in our Privacy Policy.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      paragraphs: ["You must use the Services lawfully and in accordance with these Terms. You must not:"],
      bullets: [
        "use the Services in any unlawful, fraudulent, misleading, or deceptive manner;",
        "upload content or data you do not have the right to use;",
        "attempt unauthorized access to any account, system, or data connected with the Services;",
        "reverse engineer, scrape, or disrupt the Services except where prohibited restrictions cannot apply by law;",
        "use automated means to access the Services other than through features we provide;",
        "harass, abuse, or impersonate any person; or",
        "create multiple accounts to evade limits or enforcement action.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      paragraphs: [
        "We own or license all rights in the Services, including software, design, interfaces, and content, excluding Your Data. These Terms do not transfer any intellectual property rights to you except the limited right to use the Services in accordance with these Terms.",
        "If you provide feedback or suggestions about the Services, you grant us a perpetual, irrevocable, worldwide, royalty-free licence to use that feedback without obligation to you.",
      ],
    },
    {
      id: "third-party",
      title: "Third-party services",
      paragraphs: [
        "The Services rely on third-party providers including Supabase (hosting and authentication), Anthropic (AI processing), Vercel (deployment), and Google (optional sign-in). Your use of those services may be subject to their separate terms and privacy practices.",
        "We are not responsible for third-party services except to the extent liability cannot be excluded by applicable law.",
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers and limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, the Services are provided on an \"as is\" and \"as available\" basis. We do not warrant uninterrupted, secure, or error-free operation, or that any AI-generated output will be accurate, complete, or suitable for your circumstances.",
        "To the maximum extent permitted by law, we are not liable for indirect, incidental, special, or consequential damages, or for loss of profits, revenue, data, or goodwill. Our total aggregate liability arising from the Services or these Terms will not exceed one hundred US dollars (USD $100), or the amount you paid us in the twelve months before the claim, whichever is greater.",
        "Nothing in these Terms limits liability that cannot lawfully be limited, including for fraud or willful misconduct.",
      ],
    },
    {
      id: "termination",
      title: "Termination, changes, and contact",
      paragraphs: [
        "You may stop using the Services at any time and may delete your data from Settings. We may suspend or terminate access if you materially breach these Terms, if required for security or legal reasons, or with reasonable notice if we discontinue the Services.",
        "We may amend these Terms. If we make a material change, we will provide at least 14 days' notice by email or in-app notice before the change takes effect, unless a sooner change is required for legal, security, or abuse-prevention reasons. Continued use after the effective date constitutes acceptance.",
        "Disputes that cannot be resolved informally may be brought in the state or federal courts located in Delaware, unless applicable law requires otherwise.",
        "Questions about these Terms: hello@monae.app.",
      ],
    },
  ],
};
