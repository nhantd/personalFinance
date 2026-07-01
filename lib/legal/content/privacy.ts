import type { LegalDocumentMeta } from "@/lib/legal/types";

export const PRIVACY_DOCUMENT: LegalDocumentMeta = {
  slug: "privacy",
  label: "PRIVACY POLICY",
  title: "Privacy policy.",
  description: "How Monae collects, uses, and protects your information.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      paragraphs: [
        "We are committed to protecting your privacy and handling your personal information in an open and transparent manner.",
        "This Privacy Policy explains how we collect, use, hold, disclose, and otherwise handle your personal information when you access or use the Monae website, platform, and related services (the Services).",
        "If you have questions about this Privacy Policy, contact us using the details at the end of this document.",
      ],
    },
    {
      id: "about",
      title: "About Monae",
      paragraphs: [
        "Monae is an AI-powered personal finance platform that lets you upload bank statements and other financial information to gain spending insights, track net worth, and receive AI-generated answers grounded in your data.",
        "Monae is not a licensed financial adviser. Nothing on Monae constitutes financial, investment, tax, or legal advice.",
      ],
    },
    {
      id: "collect",
      title: "Information we collect",
      paragraphs: ["Depending on how you use the Services, we may collect:"],
      bullets: [
        "account information such as your name and email address;",
        "authentication details when you sign in with email/password or Google OAuth;",
        "financial transaction data from uploaded bank statements (CSV or PDF), including dates, descriptions, amounts, and merchant information;",
        "manual wealth entries you add, such as investments, property, liabilities, and net worth records;",
        "AI chat messages and conversation history;",
        "communications you send to us; and",
        "technical and usage data such as IP address, browser type, device information, and log data.",
      ],
    },
    {
      id: "how-collect",
      title: "How we collect information",
      paragraphs: [
        "We collect information when you register for an account, upload statements or files, add wealth entries, use AI features, contact support, or interact with the Services.",
        "We may also receive limited information from third parties when you choose to sign in with Google or when service providers assist us in operating the Services.",
        "If you do not provide certain information, some parts of the Services may not function properly.",
      ],
    },
    {
      id: "why-use",
      title: "Why we use your information",
      paragraphs: ["We use personal information to:"],
      bullets: [
        "provide, operate, and maintain the Services;",
        "create and manage your account;",
        "parse, categorize, and analyze uploaded financial data;",
        "generate insights and respond to AI chat questions;",
        "communicate with you about your account or service updates;",
        "improve, monitor, and secure the Services;",
        "detect and prevent fraud, abuse, or unlawful activity; and",
        "comply with legal obligations.",
      ],
    },
    {
      id: "ai-processing",
      title: "AI processing",
      paragraphs: [
        "Monae uses AI tools provided by Anthropic to deliver features such as statement parsing, transaction categorization, and conversational Q&A.",
        "When you use these features, we may send relevant data to Anthropic, including transaction descriptions, dates, amounts, summarized financial context, and the messages you type into AI chat. We limit shared data to what is reasonably necessary for each function.",
        "Under Anthropic's standard API terms, API inputs are not used to train Anthropic's general models. Data may be retained for a limited period for abuse monitoring as described in Anthropic's policies.",
        "AI-generated outputs are probabilistic and may be incomplete or inaccurate. They should be independently verified before being relied on for significant decisions.",
      ],
    },
    {
      id: "financial-data",
      title: "How we handle financial data",
      paragraphs: [
        "Your financial data is used to provide the Services to you, including dashboards, net worth tracking, and AI insights.",
        "We do not sell your personal information or individual transaction-level financial data.",
        "Monae does not connect directly to your bank accounts, does not use Open Banking, and does not ask for your internet banking credentials.",
        "If account numbers or other sensitive identifiers appear incidentally in an uploaded file, we handle them in accordance with this Privacy Policy and do not use them to access your bank.",
      ],
    },
    {
      id: "disclosure",
      title: "Disclosure to service providers",
      paragraphs: [
        "We may disclose personal information to service providers who assist us in operating the Services.",
        "We may also disclose information where required by law, to protect rights and safety, or in connection with a business transaction such as a merger or acquisition, subject to appropriate safeguards.",
        "We do not sell, trade, or rent your personal information to third parties for their independent marketing purposes.",
      ],
      bullets: [
        "Supabase — database, authentication, and file storage (United States)",
        "Anthropic — AI processing (United States)",
        "Vercel — web hosting and deployment (United States)",
        "Google — optional OAuth sign-in (United States)",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and similar technologies",
      paragraphs: [
        "We use cookies and similar technologies to keep you signed in, maintain session state, and support core functionality of the Services.",
        "We do not currently use third-party advertising cookies. You may control cookies through your browser settings, but disabling them may affect functionality.",
      ],
    },
    {
      id: "transfers",
      title: "International data transfers",
      paragraphs: [
        "Our service providers may process personal information in the United States and other countries. Privacy laws in those jurisdictions may differ from the laws where you live.",
        "Where we transfer personal information internationally, we take reasonable steps to ensure it is handled in a manner consistent with this Privacy Policy and applicable law.",
      ],
    },
    {
      id: "retention",
      title: "Retention and deletion",
      paragraphs: [
        "We retain personal information only as long as reasonably necessary to provide the Services, comply with legal obligations, resolve disputes, and maintain security records.",
        "You may delete your uploaded data — including statements, transactions, net worth entries, and chat history — at any time from Settings using the one-click delete feature. Your account may remain active unless you also request account closure.",
        "Backups and operational logs may persist for a limited period before being overwritten. We may retain minimal records where required for legal, security, or fraud-prevention purposes.",
      ],
    },
    {
      id: "rights",
      title: "Your privacy rights",
      paragraphs: [
        "Depending on where you live, you may have rights to access, correct, delete, or obtain a copy of your personal information, or to opt out of certain processing.",
        "Most of your data is visible and manageable within the Services. To make a privacy request, contact hello@monae.app. We may need to verify your identity before responding.",
        "If you are a California resident, you may have additional rights under the CCPA/CPRA, including the right to know what personal information we collect and the right to request deletion, subject to applicable exceptions.",
      ],
    },
    {
      id: "children",
      title: "Children's privacy",
      paragraphs: [
        "The Services are not directed to children under 18. We do not knowingly collect personal information from anyone under 18. If we learn that we have collected such information, we will take reasonable steps to delete it.",
      ],
    },
    {
      id: "changes",
      title: "Changes and contact",
      paragraphs: [
        "We may update this Privacy Policy from time to time. If we make a material change, we may notify you by email, through the Services, or by posting an updated version on our website. The updated version takes effect from the date stated at the top of this policy.",
        "For privacy questions or requests: hello@monae.app.",
        "This Privacy Policy does not constitute legal advice. We recommend seeking independent legal counsel to ensure compliance with laws applicable to your situation.",
      ],
    },
  ],
};
