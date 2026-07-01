import { LegalDocument } from "@/components/legal/legal-document";
import { TERMS_DOCUMENT } from "@/lib/legal/content/terms";
import { BRAND } from "@/lib/brand";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata = createPageMetadata({
  title: `Terms of Service — ${BRAND.name}`,
  description: TERMS_DOCUMENT.description,
  path: "/terms",
});

export default function TermsPage() {
  return <LegalDocument document={TERMS_DOCUMENT} />;
}
