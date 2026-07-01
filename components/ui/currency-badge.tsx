import { cn } from "@/lib/utils";
import { getCurrencyMeta } from "@/lib/currencies";

interface CurrencyBadgeProps {
  code: string;
  showName?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function CurrencyBadge({
  code,
  showName = false,
  size = "sm",
  className,
}: CurrencyBadgeProps) {
  const meta = getCurrencyMeta(code);
  const displayCode = meta?.code ?? code.toUpperCase();

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-md bg-muted font-mono font-semibold text-foreground",
          size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
        )}
      >
        {displayCode}
      </span>
      {showName && meta && (
        <span className={cn("truncate text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          {meta.name}
        </span>
      )}
    </span>
  );
}

interface CurrencyHintProps {
  code: string;
  className?: string;
}

/** Inline hint e.g. "amounts shown in VND · Vietnamese Dong" */
export function CurrencyHint({ code, className }: CurrencyHintProps) {
  const meta = getCurrencyMeta(code);

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5 text-muted-foreground", className)}>
      <CurrencyBadge code={code} />
      {meta && <span className="text-xs">{meta.name}</span>}
    </span>
  );
}
