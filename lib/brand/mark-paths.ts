import { COLORS } from "@/lib/colors";

export const MONAE_MARK_VIEWBOX = "0 0 32 32";
export const MONAE_MARK_RADIUS = 7;

/** Filled geometric M — tuned for 16–32px legibility */
export const MONOGRAM_PATH =
  "M9 8h4.5L16 14.5 18.5 8H23v14h-4.5l-2.5-6.5L13.5 22H9V8z";

export const CENT_DOT = {
  cx: 24.5,
  cy: 24.5,
  r: 3.25,
  ringR: 4.25,
} as const;

export type MonaeMarkVariant = "default" | "inverse";

export function getMonaeMarkPalette(variant: MonaeMarkVariant) {
  if (variant === "inverse") {
    return {
      background: COLORS.white,
      monogram: COLORS.darkGreen,
      dot: COLORS.mint,
      ring: COLORS.white,
    };
  }
  return {
    background: COLORS.darkGreen,
    monogram: COLORS.white,
    dot: COLORS.mint,
    ring: COLORS.darkGreen,
  };
}

export function renderMonaeMarkSvg({
  variant = "default",
  size = 32,
}: {
  variant?: MonaeMarkVariant;
  size?: number;
}) {
  const palette = getMonaeMarkPalette(variant);
  const { cx, cy, r, ringR } = CENT_DOT;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${MONAE_MARK_VIEWBOX}" fill="none" role="img" aria-label="Monae">
  <rect width="32" height="32" rx="${MONAE_MARK_RADIUS}" fill="${palette.background}"/>
  <path d="${MONOGRAM_PATH}" fill="${palette.monogram}"/>
  <circle cx="${cx}" cy="${cy}" r="${ringR}" fill="${palette.ring}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${palette.dot}"/>
</svg>`;
}
