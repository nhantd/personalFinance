"use client";

import { useEffect, useRef, useState } from "react";
import { MockEditorialCard } from "@/components/marketing/mocks/mock-editorial-card";
import { brandClasses } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { MOCK_BUDGET } from "@/lib/marketing/mock-data";
import { cn } from "@/lib/utils";

const BUDGET_META = MARKETING_COPY.featureItems.find((f) => f.id === "budget")!;

export function MockSummaryCards() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full">
      <MockEditorialCard
        title={BUDGET_META.title}
        subtitle={BUDGET_META.subtitle}
        index="02 / BUDGET"
        variant="compact"
        className="pb-0"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Income {MOCK_BUDGET.income} · {MOCK_BUDGET.categories} categories
        </p>
        <div className="mt-3 flex items-end gap-3">
          <div className="flex flex-1 flex-col justify-center rounded-md bg-brand-dark px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">Budget</p>
            <p className="mt-0.5 font-heading text-lg font-light text-white">{MOCK_BUDGET.budget}</p>
          </div>
          <div
            className={cn(
              "flex flex-1 flex-col justify-end pb-0.5",
              visible && "animate-in fade-in zoom-in-95 duration-700"
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Cash left over
            </p>
            <p className={`${brandClasses.mockSerifStat} text-xl text-success`}>{MOCK_BUDGET.surplus}</p>
          </div>
        </div>
        <div
          className={`-mx-3 -mb-3 mt-3 border-t border-foreground/10 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wide ${brandClasses.insightBg} text-foreground`}
        >
          {MOCK_BUDGET.actionLabel}
        </div>
      </MockEditorialCard>
    </div>
  );
}
