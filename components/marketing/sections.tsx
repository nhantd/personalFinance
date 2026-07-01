import { MessageSquare } from "lucide-react";
import { HowItWorksPipeline } from "@/components/marketing/how-it-works-pipeline";
import { MockChatSnippet } from "@/components/marketing/mocks/mock-chat-snippet";
import { MockDashboardChart } from "@/components/marketing/mocks/mock-dashboard-chart";
import { MockPrivacyBadge } from "@/components/marketing/mocks/mock-privacy-badge";
import { MockSummaryCards } from "@/components/marketing/mocks/mock-summary-cards";
import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { brandClasses, BRAND } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";

export function HowItWorksSection() {
  const { howItWorks } = MARKETING_COPY;

  return (
    <section
      id="how-it-works"
      className="border-b border-border bg-muted/40 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className={brandClasses.label}>{howItWorks.label}</p>
        <h2 className={`mt-3 ${brandClasses.heading}`}>{howItWorks.heading}</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          {howItWorks.subline}
        </p>
        <HowItWorksPipeline />
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
        <p className="mt-4 max-w-xl text-muted-foreground">
          {features.subline}
        </p>
        <RevealOnScroll className="mt-14">
          <div className="rounded-xl border border-foreground/10 bg-card/50 p-4 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <MockDashboardChart />
              </div>
              <MockSummaryCards />
              <MockChatSnippet />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function PrivacySection() {
  return (
    <section id="privacy" className="border-b border-border bg-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll>
            <div>
              <p className={brandClasses.label}>Privacy</p>
              <h2 className={`mt-3 ${brandClasses.heading}`}>
                Your data stays yours
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Your statements, your upload, your call. {BRAND.name} encrypts
                your data, never sells it, and lets you delete everything with
                one click in Settings.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <MockPrivacyBadge />
          </RevealOnScroll>
        </div>
        <p className="mt-12 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          No connection · No API · No screen-scraping · Ever
        </p>
      </div>
    </section>
  );
}

export function AskSection() {
  const { askSection } = MARKETING_COPY;

  return (
    <section id="ask" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <RevealOnScroll>
            <div>
              <p className={brandClasses.label}>Ask Monae</p>
              <h2 className={`mt-3 ${brandClasses.heading}`}>
                Ask anything. Answered from your numbers.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                Plain-language questions over your uploaded statements — not
                generic advice. Every answer is computed from your real
                transactions.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {askSection.suggestedQuestions.map((q) => (
                  <span
                    key={q}
                    className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className={`${brandClasses.card} space-y-4 p-5`}>
              {askSection.examples.map((ex) => (
                <div key={ex.question} className="space-y-2">
                  <div className="rounded-lg bg-muted px-4 py-3 text-sm text-foreground">
                    {ex.question}
                  </div>
                  <div className="flex gap-2 px-1">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {ex.answerLead}{" "}
                      <span className="font-semibold text-foreground">
                        {ex.answerHighlight}
                      </span>
                      {ex.answerTail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
