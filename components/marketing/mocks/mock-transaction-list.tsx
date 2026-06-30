import { brandClasses } from "@/lib/brand";
import { MOCK_TRANSACTIONS } from "@/lib/marketing/mock-data";
import { cn } from "@/lib/utils";

export function MockTransactionList({ compact = false }: { compact?: boolean }) {
  const rows = compact ? MOCK_TRANSACTIONS.slice(0, 3) : MOCK_TRANSACTIONS;

  return (
    <div className={cn("font-mono text-sm", compact && "text-xs")}>
      {rows.map((tx) => (
        <div
          key={tx.desc}
          className={cn(
            "flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-border/60 py-2 last:border-0",
            "creep" in tx && tx.creep && "rounded-md bg-amber-50/80 px-2 -mx-1"
          )}
        >
          <span className="w-10 shrink-0 text-muted-foreground">{tx.date}</span>
          <span className="min-w-0 flex-1 truncate text-foreground">{tx.desc}</span>
          {!compact && (
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-sans text-muted-foreground">
              {tx.cat}
            </span>
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
