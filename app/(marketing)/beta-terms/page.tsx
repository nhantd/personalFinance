import { LegalDocument } from "@/components/legal/legal-document";
import { BETA_TERMS_DOCUMENT } from "@/lib/legal/content/beta-terms";
import { BRAND } from "@/lib/brand";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata = {
  ...createPageMetadata({
    title: `Beta Terms — ${BRAND.name}`,
    description: BETA_TERMS_DOCUMENT.description,
    path: "/beta-terms",
    index: false,
    follow: false,
  }),
};

export default function BetaTermsPage() {
  return <LegalDocument document={BETA_TERMS_DOCUMENT} />;
}
