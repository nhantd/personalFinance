import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { BETA_TERMS_DOCUMENT } from "@/lib/legal/content/beta-terms";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Beta Terms — ${BRAND.name}`,
  description: BETA_TERMS_DOCUMENT.description,
};

export default function BetaTermsPage() {
  return <LegalDocument document={BETA_TERMS_DOCUMENT} />;
}
