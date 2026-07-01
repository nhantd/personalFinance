import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  getDefaultOpenGraph,
  getDefaultTwitter,
  getGoogleSiteVerification,
  getLegalLastModified,
  LEGAL_PAGE_PATHS,
  SITE_NAME,
} from "@/lib/seo/metadata";

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "https://monae.app";
  return url.replace(/\/$/, "");
}

export const SITEMAP_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/signup", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/security", priority: 0.3, changeFrequency: "yearly" as const },
];

export const ROBOTS_DISALLOW = [
  "/api/",
  "/dashboard",
  "/budget",
  "/net-worth",
  "/investments",
  "/upload",
  "/transactions",
  "/settings",
  "/auth/",
  "/beta-terms",
  "/login",
];

interface CreatePageMetadataOptions {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  follow?: boolean;
  keywords?: readonly string[];
}

export function createPageMetadata({
  title,
  description,
  path,
  index = true,
  follow = true,
  keywords,
}: CreatePageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${getSiteUrl()}${canonicalPath === "/" ? "" : canonicalPath}`;

  return {
    title,
    description,
    ...(keywords ? { keywords: [...keywords] } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      ...getDefaultOpenGraph(),
      title,
      description,
      url,
    },
    twitter: {
      ...getDefaultTwitter(),
      title,
      description,
    },
    robots: {
      index,
      follow,
    },
  };
}

export function getSitemapLastModified(path: string) {
  if ((LEGAL_PAGE_PATHS as readonly string[]).includes(path)) {
    return getLegalLastModified();
  }
  return new Date();
}

export function buildRootMetadata(): Metadata {
  const verification = getGoogleSiteVerification();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: DEFAULT_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      ...getDefaultOpenGraph(),
      url: getSiteUrl(),
    },
    twitter: getDefaultTwitter(),
    robots: {
      index: true,
      follow: true,
    },
    ...(verification
      ? {
          verification: {
            google: verification,
          },
        }
      : {}),
  };
}

export const NOINDEX_FOLLOW_METADATA: Pick<Metadata, "robots"> = {
  robots: {
    index: false,
    follow: true,
  },
};

export const NOINDEX_NOFOLLOW_METADATA: Pick<Metadata, "robots"> = {
  robots: {
    index: false,
    follow: false,
  },
};
