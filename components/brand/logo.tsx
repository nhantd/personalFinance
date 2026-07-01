import Link from "next/link";
import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/colors";
import { BRAND, brandClasses } from "@/lib/brand";

export function Logo({
  className,
  href = "/",
  variant = "default",
}: {
  className?: string;
  href?: string;
  variant?: "default" | "inverse";
}) {
  const isInverse = variant === "inverse";

  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
          isInverse ? "bg-white text-[#082321]" : "text-white"
        )}
        style={isInverse ? undefined : { backgroundColor: COLORS.darkGreen }}
      >
        M
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2",
            isInverse ? "ring-white" : "ring-background"
          )}
          style={{ backgroundColor: COLORS.mint }}
        />
      </span>
      <span
        className={cn(
          brandClasses.logo,
          isInverse && "font-semibold text-white"
        )}
      >
        {BRAND.name}
      </span>
    </Link>
  );
}
