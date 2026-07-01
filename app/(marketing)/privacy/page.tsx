import { LegalDocument } from "@/components/legal/legal-document";
import { PRIVACY_DOCUMENT } from "@/lib/legal/content/privacy";
import { BRAND } from "@/lib/brand";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata = createPageMetadata({
  title: `Privacy Policy — ${BRAND.name}`,
  description: PRIVACY_DOCUMENT.description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalDocument document={PRIVACY_DOCUMENT} />;
}
