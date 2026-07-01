import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { SECURITY_DOCUMENT } from "@/lib/legal/content/security";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Security — ${BRAND.name}`,
  description: SECURITY_DOCUMENT.description,
};

export default function SecurityPage() {
  return <LegalDocument document={SECURITY_DOCUMENT} />;
}
