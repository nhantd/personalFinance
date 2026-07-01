import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { TERMS_DOCUMENT } from "@/lib/legal/content/terms";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Terms of Service — ${BRAND.name}`,
  description: TERMS_DOCUMENT.description,
};

export default function TermsPage() {
  return <LegalDocument document={TERMS_DOCUMENT} />;
}
