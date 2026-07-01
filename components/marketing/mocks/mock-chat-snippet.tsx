import { MessageSquare } from "lucide-react";
import { MockEditorialCard } from "@/components/marketing/mocks/mock-editorial-card";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { MOCK_ASK_FEATURE } from "@/lib/marketing/mock-data";

const ASK_META = MARKETING_COPY.featureItems.find((f) => f.id === "ask")!;

export function MockChatSnippet() {
  return (
    <MockEditorialCard
      title={ASK_META.title}
      subtitle={ASK_META.subtitle}
      index="04 / ASK"
      variant="compact"
    >
      <div className="space-y-2">
        <div className="rounded-md bg-muted px-3 py-2 text-sm text-foreground">
          {MOCK_ASK_FEATURE.question}
        </div>
        <div className="flex gap-2">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p className="text-sm leading-snug text-muted-foreground">
            {MOCK_ASK_FEATURE.answerLead}{" "}
            <span className="font-semibold text-foreground">{MOCK_ASK_FEATURE.answerAmount}</span>
            {MOCK_ASK_FEATURE.answerTail}
          </p>
        </div>
      </div>
    </MockEditorialCard>
  );
}
