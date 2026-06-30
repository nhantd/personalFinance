import type { ReactNode } from "react";
import { brandClasses } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface MockEditorialCardProps {
  title: string;
  index: string;
  children: ReactNode;
  footer?: string;
  subtitle?: string;
  variant?: "default" | "compact";
  className?: string;
}

export function MockEditorialCard({
  title,
  index,
  children,
  footer,
  subtitle,
  variant = "default",
  className,
}: MockEditorialCardProps) {
  const compact = variant === "compact";

  return (
    <div className={cn(brandClasses.mockCard, "flex h-full flex-col overflow-hidden", className)}>
      <div className={cn(brandClasses.mockCardHeader, compact && "py-2")}>
        <div className="min-w-0">
          <span
            className={cn(
              "font-semibold uppercase tracking-wide text-foreground",
              compact ? "text-[10px]" : "text-xs"
            )}
          >
            {title}
          </span>
          {subtitle && (
            <p className="mt-0.5 truncate text-[10px] normal-case tracking-normal text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {index}
        </span>
      </div>
      <div className={cn("flex-1", compact ? "p-3" : "p-4")}>{children}</div>
      {footer && !compact && (
        <div className="border-t border-foreground/10 px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
