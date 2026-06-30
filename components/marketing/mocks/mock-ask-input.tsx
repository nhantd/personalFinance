import { Send } from "lucide-react";
import { brandClasses } from "@/lib/brand";

export function MockAskInput() {
  return (
    <div className={`${brandClasses.card} space-y-3 p-4`}>
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
        Am I spending more than I earn?
      </div>
      <div className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-foreground">
        Surplus of <span className="font-semibold text-success">$1,847</span> this month — income
        exceeds outflows.
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
        <span className="flex-1 text-xs text-muted-foreground">Ask about your money…</span>
        <Send className="h-4 w-4 text-accent" />
      </div>
    </div>
  );
}
