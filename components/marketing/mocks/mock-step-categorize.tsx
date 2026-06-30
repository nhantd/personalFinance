import { brandClasses } from "@/lib/brand";
import { MOCK_STEP_TRANSACTIONS } from "@/lib/marketing/mock-data";
import { MockCategoryPill } from "@/components/marketing/mocks/mock-category-pill";
import { cn } from "@/lib/utils";

export function MockStepCategorize() {
  return (
    <div className="font-mono text-xs">
      {MOCK_STEP_TRANSACTIONS.map((tx, i) => (
        <div
          key={tx.desc}
          className={cn(
            "flex flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-border/60 py-1.5 last:border-0",
            "trendHighlight" in tx && tx.trendHighlight && `rounded px-1.5 -mx-1.5 ${brandClasses.creepRow}`,
            "opacity-0 animate-fade-up"
          )}
          style={{ animationDelay: `${80 + i * 70}ms` }}
        >
          <span className="w-9 shrink-0 text-muted-foreground">{tx.date}</span>
          <span className="min-w-0 flex-1 truncate text-foreground">{tx.desc}</span>
          <MockCategoryPill label={tx.cat} tagType={tx.tagType} />
          <span className="shrink-0 text-foreground">{tx.amount}</span>
        </div>
      ))}
    </div>
  );
}
