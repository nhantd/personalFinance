import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { LEGAL_ENTITY } from "@/lib/legal/entity";
import { MARKETING_COPY } from "@/lib/marketing/copy";

export const DEFAULT_KEYWORDS = [...MARKETING_COPY.metadata.keywords];

export const DEFAULT_TITLE = MARKETING_COPY.metadata.title;

export const DEFAULT_DESCRIPTION = MARKETING_COPY.metadata.description;

export const SITE_NAME = BRAND.name;

export const OG_LOCALE = "en_US";

export function getGoogleSiteVerification(): string | undefined {
  const value = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  return value || undefined;
}

export function getDefaultOpenGraph(): Metadata["openGraph"] {
  return {
    type: "website",
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
}

export function getDefaultTwitter(): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
}

export const LEGAL_PAGE_PATHS = ["/terms", "/privacy", "/security"] as const;

export function getLegalLastModified() {
  return new Date(LEGAL_ENTITY.lastUpdated);
}
