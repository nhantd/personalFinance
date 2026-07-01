import { LegalDocument } from "@/components/legal/legal-document";
import { SECURITY_DOCUMENT } from "@/lib/legal/content/security";
import { BRAND } from "@/lib/brand";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata = createPageMetadata({
  title: `Security — ${BRAND.name}`,
  description: SECURITY_DOCUMENT.description,
  path: "/security",
});

export default function SecurityPage() {
  return <LegalDocument document={SECURITY_DOCUMENT} />;
}
