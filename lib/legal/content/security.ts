import type { LegalDocumentMeta } from "@/lib/legal/types";

export const SECURITY_DOCUMENT: LegalDocumentMeta = {
  slug: "security",
  label: "SECURITY",
  title: "Security.",
  description: "How Monae protects your data.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      paragraphs: [
        "Monae is built privacy-first. We designed the platform so you can understand your finances without handing over bank credentials or granting Open Banking access.",
        "This page summarizes the technical and operational measures we use to protect your data. For details on what we collect and how we use it, see our Privacy Policy.",
      ],
    },
    {
      id: "no-credentials",
      title: "No bank credentials",
      paragraphs: [
        "Monae never asks for your bank login, password, PIN, or security questions. You upload statements as CSV or PDF files that you export from your bank.",
        "We do not use Open Banking, screen scraping, or automated bank logins. Your credentials stay with your bank.",
      ],
    },
    {
      id: "encryption",
      title: "Encryption",
      paragraphs: [
        "All traffic between your browser and Monae is encrypted in transit using HTTPS (TLS).",
        "Data stored in our database and file storage is encrypted at rest through our infrastructure providers.",
      ],
    },
    {
      id: "access-controls",
      title: "Access controls",
      paragraphs: [
        "Monae uses row-level security (RLS) on database tables so each user can only access their own records.",
        "Uploaded statement files are stored in private storage buckets scoped to your account. Application access is restricted through authenticated API routes.",
        "We apply the principle of least privilege for internal access to production systems.",
      ],
    },
    {
      id: "authentication",
      title: "Authentication",
      paragraphs: [
        "Accounts are managed through Supabase Auth. You may sign in with email and password or optional Google OAuth.",
        "You are responsible for keeping your login credentials confidential and signing out on shared devices.",
      ],
    },
    {
      id: "deletion",
      title: "Data deletion",
      paragraphs: [
        "You can delete all your uploaded data — statements, transactions, net worth entries, and chat history — with one click from Settings.",
        "Deletion is designed to remove your financial records from active systems. Residual copies in backups may persist briefly before being overwritten.",
      ],
    },
    {
      id: "ai-handling",
      title: "AI data handling",
      paragraphs: [
        "When you use AI features, only the data needed for that request is sent to Anthropic for processing. We never send bank credentials because we never collect them.",
        "AI outputs are generated from your uploaded data and should be verified before you rely on them for important decisions.",
      ],
    },
    {
      id: "report",
      title: "Report a security issue",
      paragraphs: [
        "If you discover a security vulnerability or suspect unauthorized access to your account, contact us promptly at hello@monae.app with as much detail as possible.",
        "We investigate good-faith reports and will work to address confirmed issues. Please do not publicly disclose vulnerabilities before we have had a reasonable opportunity to respond.",
        "No method of transmission or storage is completely secure. While we take reasonable steps to protect your information, we cannot guarantee absolute security.",
      ],
    },
  ],
};
