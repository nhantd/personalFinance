import { ChevronDown, ChevronRight } from "lucide-react";
import { MockStepAsk } from "@/components/marketing/mocks/mock-step-ask";
import { MockStepCategorize } from "@/components/marketing/mocks/mock-step-categorize";
import { MockStepUpload } from "@/components/marketing/mocks/mock-step-upload";
import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { MARKETING_COPY } from "@/lib/marketing/copy";

const STEP_MOCKS = [MockStepUpload, MockStepCategorize, MockStepAsk] as const;

function StepConnector() {
  return (
    <div className="flex items-center justify-center self-center px-1 py-1 md:py-0">
      <ChevronRight className="hidden h-4 w-4 text-muted-foreground/60 md:block" />
      <ChevronDown className="h-4 w-4 text-muted-foreground/60 md:hidden" />
    </div>
  );
}

export function HowItWorksPipeline() {
  const { steps } = MARKETING_COPY.howItWorks;

  return (
    <div className="mt-14 rounded-xl border border-foreground/10 bg-card/50 p-4 sm:p-6">
      <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-2">
        {steps.map((step, i) => {
          const Mock = STEP_MOCKS[i];
          return (
            <div key={step.index} className="contents">
              <RevealOnScroll delay={i * 150} className="min-w-0">
                <div className="flex h-full flex-col">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                    {step.index} · {step.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{step.description}</p>
                  <div className="mt-3 flex-1">
                    <Mock />
                  </div>
                </div>
              </RevealOnScroll>
              {i < steps.length - 1 && <StepConnector />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
