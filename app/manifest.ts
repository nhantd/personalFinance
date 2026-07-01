import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { COLORS } from "@/lib/colors";
import { DEFAULT_DESCRIPTION } from "@/lib/seo/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.name,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: COLORS.darkGreen,
    theme_color: COLORS.darkGreen,
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
