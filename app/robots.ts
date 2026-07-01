import type { MetadataRoute } from "next";
import { getSiteUrl, getSitemapLastModified, ROBOTS_DISALLOW, SITEMAP_ROUTES } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ROBOTS_DISALLOW,
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  };
}
