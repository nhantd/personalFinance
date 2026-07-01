import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { PRIVACY_DOCUMENT } from "@/lib/legal/content/privacy";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND.name}`,
  description: PRIVACY_DOCUMENT.description,
};

export default function PrivacyPage() {
  return <LegalDocument document={PRIVACY_DOCUMENT} />;
}
