import { brandClasses } from "@/lib/brand";
import { MOCK_TRANSACTIONS } from "@/lib/marketing/mock-data";
import { MockCategoryPill } from "@/components/marketing/mocks/mock-category-pill";
import { cn } from "@/lib/utils";

export function MockTransactionList({
  compact = false,
  animateRows = false,
  rows = compact ? MOCK_TRANSACTIONS.slice(0, 3) : MOCK_TRANSACTIONS,
}: {
  compact?: boolean;
  animateRows?: boolean;
  rows?: readonly (typeof MOCK_TRANSACTIONS)[number][];
}) {
  return (
    <div className={cn("font-mono text-sm", compact && "text-xs")}>
      {rows.map((tx, i) => (
        <div
          key={tx.desc}
          className={cn(
            "flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-border/60 py-2 last:border-0",
            "trendHighlight" in tx &&
              tx.trendHighlight &&
              `rounded-md px-2 -mx-1 ${brandClasses.creepRow}`,
            animateRows && "opacity-0 animate-fade-up"
          )}
          style={animateRows ? { animationDelay: `${120 + i * 80}ms` } : undefined}
        >
          <span className="w-10 shrink-0 text-muted-foreground">{tx.date}</span>
          <span className="min-w-0 flex-1 truncate text-foreground">{tx.desc}</span>
          {!compact && (
            <>
              <MockCategoryPill label={tx.cat} tagType={tx.tagType} />
              {"trendLabel" in tx && tx.trendLabel && (
                <span className="text-[10px] font-sans font-semibold text-highlight-warm">
                  {tx.trendLabel}
                </span>
              )}
            </>
          )}
          <span
            className={cn(
              "shrink-0 text-right",
              "positive" in tx && tx.positive ? brandClasses.income : "text-foreground"
            )}
          >
            {tx.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
