import type { MetadataRoute } from "next";
import { getSiteUrl, getSitemapLastModified, SITEMAP_ROUTES } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  return SITEMAP_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: getSitemapLastModified(path),
    changeFrequency,
    priority,
  }));
}
