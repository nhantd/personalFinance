import type { MetadataRoute } from "next";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://monae.app";
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${getAppUrl()}/sitemap.xml`,
  };
}
