import { Send } from "lucide-react";
import { brandClasses } from "@/lib/brand";
import { MOCK_ASK_STEP } from "@/lib/marketing/mock-data";

export function MockAskInput() {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
        {MOCK_ASK_STEP.question}
      </div>
      <div className={`rounded-lg px-3 py-2 text-sm text-foreground ${brandClasses.insightBg}`}>
        {MOCK_ASK_STEP.answer}
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
        <span className="flex-1 text-xs text-muted-foreground">Ask about your money…</span>
        <Send className="h-4 w-4 text-accent" />
      </div>
    </div>
  );
}
