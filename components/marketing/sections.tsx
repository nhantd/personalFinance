import { MessageSquare } from "lucide-react";
import { MockAskInput } from "@/components/marketing/mocks/mock-ask-input";
import { MockChatSnippet } from "@/components/marketing/mocks/mock-chat-snippet";
import { MockDashboardChart } from "@/components/marketing/mocks/mock-dashboard-chart";
import { MockPrivacyBadge } from "@/components/marketing/mocks/mock-privacy-badge";
import { MockSummaryCards } from "@/components/marketing/mocks/mock-summary-cards";
import { MockTransactionList } from "@/components/marketing/mocks/mock-transaction-list";
import { MockUploadDropzone } from "@/components/marketing/mocks/mock-upload-dropzone";
import { brandClasses, BRAND } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { cn } from "@/lib/utils";

const FEATURE_MOCKS = {
  spending: MockDashboardChart,
  budget: MockSummaryCards,
  ask: MockChatSnippet,
  privacy: MockPrivacyBadge,
} as const;

const ASK_EXAMPLES = [
  {
    question: "How much did I spend on subscriptions last month?",
    answer: (
      <>
        <span className="font-semibold text-foreground">$127.42</span> across 4 recurring charges.
      </>
    ),
  },
  {
    question: "Am I spending more than I earn?",
    answer: (
      <>
        Surplus of <span className="font-semibold text-success">$1,847</span> this month — income
        exceeds outflows.
      </>
    ),
  },
  {
    question: "What's my biggest expense category?",
    answer: (
      <>
        Housing at <span className="font-semibold text-foreground">$1,850</span>, followed by
        groceries at $312.
      </>
    ),
  },
];

const SUGGESTED_QUESTIONS = [
  "How much did I spend on subscriptions last month?",
  "Am I spending more than I earn?",
  "What's my biggest expense category?",
];

export function HowItWorksSection() {
  const { howItWorks } = MARKETING_COPY;

  return (
    <section id="how-it-works" className="border-b border-border bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className={brandClasses.label}>{howItWorks.label}</p>
        <h2 className={`mt-3 ${brandClasses.heading}`}>{howItWorks.heading}</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{howItWorks.subline}</p>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <div key={step.title} className="flex flex-col">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <div className="mt-5">
                {i === 0 && <MockUploadDropzone />}
                {i === 1 && (
                  <div className={`${brandClasses.card} p-3`}>
                    <MockTransactionList compact />
                  </div>
                )}
                {i === 2 && <MockAskInput />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const { features } = MARKETING_COPY;

  return (
    <section id="features" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className={brandClasses.label}>{features.label}</p>
        <h2 className={`mt-3 ${brandClasses.heading}`}>{features.heading}</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{features.subline}</p>
        <div className="mt-16 space-y-20">
          {MARKETING_COPY.featureItems.map((f, i) => {
            const Mock = FEATURE_MOCKS[f.id as keyof typeof FEATURE_MOCKS];
            const mockFirst = i % 2 === 1;
            return (
              <div
                key={f.id}
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  mockFirst && "lg:[direction:rtl]"
                )}
              >
                <div className={cn(mockFirst && "lg:[direction:ltr]")}>
                  <Mock />
                </div>
                <div className={cn(mockFirst && "lg:[direction:ltr]")}>
                  <h3 className="text-2xl font-semibold">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PrivacySection() {
  return (
    <section id="privacy" className="border-b border-border bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className={brandClasses.label}>Privacy</p>
            <h2 className={`mt-3 ${brandClasses.heading}`}>
              Your data stays yours
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Your statements, your upload, your call. {BRAND.name} encrypts your data, never
              sells it, and lets you delete everything with one click in Settings.
            </p>
          </div>
          <MockPrivacyBadge />
        </div>
        <p className="mt-12 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          No connection · No API · No screen-scraping · Ever
        </p>
      </div>
    </section>
  );
}

export function AskSection() {
  return (
    <section id="ask" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className={brandClasses.label}>Ask Monae</p>
            <h2 className={`mt-3 ${brandClasses.heading}`}>
              Ask anything. Answered from your numbers.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Plain-language questions over your uploaded statements — not generic advice. Every
              answer is computed from your real transactions.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <span
                  key={q}
                  className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>

          <div className={`${brandClasses.card} space-y-4 p-5`}>
            {ASK_EXAMPLES.map((ex) => (
              <div key={ex.question} className="space-y-2">
                <div className="rounded-lg bg-muted px-4 py-3 text-sm text-foreground">
                  {ex.question}
                </div>
                <div className="flex gap-2 px-1">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{ex.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
