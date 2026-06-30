import Link from "next/link";
import { MonaeMark } from "@/components/brand/monae-mark";
import { cn } from "@/lib/utils";
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
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <MonaeMark size={32} variant={variant} />
      <span
        className={cn(
          brandClasses.logo,
          "font-semibold",
          isInverse && "text-white"
        )}
      >
        {BRAND.name}
      </span>
    </Link>
  );
}
