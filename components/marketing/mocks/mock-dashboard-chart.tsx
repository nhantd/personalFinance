"use client";

import { useEffect, useRef, useState } from "react";
import { MockEditorialCard } from "@/components/marketing/mocks/mock-editorial-card";
import { brandClasses } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { MOCK_FLOW } from "@/lib/marketing/mock-data";
import { cn } from "@/lib/utils";

const SPENDING_META = MARKETING_COPY.featureItems.find((f) => f.id === "spending")!;

function FlowBar({
  label,
  pct,
  colorClass,
  animate,
}: {
  label: string;
  pct: number;
  colorClass: string;
  animate: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 truncate text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-sm bg-muted/60">
        <div
          className={cn("h-full rounded-sm", colorClass, animate && "animate-bar-grow")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function MockDashboardChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setAnimate(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setAnimate(true);
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
        title={SPENDING_META.title}
        subtitle={SPENDING_META.subtitle}
        index="02 / SPENDING"
        variant="compact"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Inflows
            </p>
            {MOCK_FLOW.inflows.map((item) => (
              <FlowBar
                key={item.label}
                label={item.label}
                pct={item.pct}
                colorClass={item.color}
                animate={animate}
              />
            ))}
          </div>
          <div className="flex w-3 flex-col items-center justify-center gap-1 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-border" />
            ))}
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Outflows
            </p>
            {MOCK_FLOW.outflows.map((item) => (
              <FlowBar
                key={item.label}
                label={item.label}
                pct={item.pct}
                colorClass={item.color}
                animate={animate}
              />
            ))}
          </div>
        </div>
        <div className="mt-3">
          <span className={brandClasses.mockInsightChip}>{MOCK_FLOW.insight}</span>
        </div>
      </MockEditorialCard>
    </div>
  );
}
