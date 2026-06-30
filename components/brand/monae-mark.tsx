import {
  CENT_DOT,
  getMonaeMarkPalette,
  MONOGRAM_PATH,
  MONAE_MARK_RADIUS,
  MONAE_MARK_VIEWBOX,
  type MonaeMarkVariant,
} from "@/lib/brand/mark-paths";
import { cn } from "@/lib/utils";

export function MonaeMark({
  size = 32,
  variant = "default",
  className,
  title = "Monae",
}: {
  size?: number;
  variant?: MonaeMarkVariant;
  className?: string;
  title?: string;
}) {
  const palette = getMonaeMarkPalette(variant);

  return (
    <svg
      width={size}
      height={size}
      viewBox={MONAE_MARK_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <rect width="32" height="32" rx={MONAE_MARK_RADIUS} fill={palette.background} />
      <path d={MONOGRAM_PATH} fill={palette.monogram} />
      <circle cx={CENT_DOT.cx} cy={CENT_DOT.cy} r={CENT_DOT.ringR} fill={palette.ring} />
      <circle cx={CENT_DOT.cx} cy={CENT_DOT.cy} r={CENT_DOT.r} fill={palette.dot} />
    </svg>
  );
}
