import { brandClasses } from "@/lib/brand";
import { MOCK_ASK_STEP } from "@/lib/marketing/mock-data";

export function MockStepAsk() {
  return (
    <div className="space-y-2">
      <div className="rounded-md border border-border bg-muted/40 px-2.5 py-2 text-xs text-foreground">
        {MOCK_ASK_STEP.question}
      </div>
      <div className={`rounded-md px-2.5 py-2 text-xs leading-relaxed text-foreground ${brandClasses.insightBg}`}>
        {MOCK_ASK_STEP.answer}
      </div>
    </div>
  );
}
