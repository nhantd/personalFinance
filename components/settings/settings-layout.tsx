import type { ReactNode } from "react";
import { brandClasses } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function SettingsSection({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SettingsCard({
  title,
  headerAction,
  children,
  className,
  variant = "default",
}: {
  title?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "default" | "danger";
}) {
  return (
    <div
      className={cn(
        brandClasses.card,
        "overflow-hidden",
        variant === "danger" && "border-destructive/25 bg-highlight-warm-bg/40",
        className
      )}
    >
      {(title || headerAction) && (
        <div
          className={cn(
            "flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3",
            variant === "danger" && "border-destructive/15"
          )}
        >
          {title && (
            <h2
              className={cn(
                "text-sm font-semibold",
                variant === "danger" && "text-destructive"
              )}
            >
              {title}
            </h2>
          )}
          {headerAction}
        </div>
      )}
      <div className="divide-y divide-border/60 px-4">{children}</div>
    </div>
  );
}

export function SettingsRow({
  label,
  description,
  children,
  className,
  align = "center",
}: {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4 sm:flex-row sm:justify-between",
        align === "start" ? "sm:items-start" : "sm:items-center",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      <div
        className={cn(
          "w-full shrink-0 sm:w-auto",
          align === "start" && "sm:pt-0.5"
        )}
      >
        {children}
      </div>
    </div>
  );
}
