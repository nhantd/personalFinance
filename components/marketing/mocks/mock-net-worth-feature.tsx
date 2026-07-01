"use client";

import { useEffect, useRef, useState } from "react";
import { MockEditorialCard } from "@/components/marketing/mocks/mock-editorial-card";
import { brandClasses } from "@/lib/brand";
import { MARKETING_COPY } from "@/lib/marketing/copy";
import { MOCK_NET_WORTH, MOCK_WEALTH_BREAKDOWN } from "@/lib/marketing/mock-data";

const NET_WORTH_META = MARKETING_COPY.featureItems.find((f) => f.id === "net-worth")!;

export function MockNetWorthFeature() {
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
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full">
      <MockEditorialCard
        title={NET_WORTH_META.title}
        subtitle={NET_WORTH_META.subtitle}
        index="01 / NET WORTH"
        variant="compact"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`${brandClasses.mockSerifStat} text-foreground`}>
              {MOCK_NET_WORTH.total}
            </p>
            <p className="mt-1 text-xs text-success">
              {MOCK_NET_WORTH.change} {MOCK_NET_WORTH.changeLabel}
            </p>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Assets {MOCK_NET_WORTH.assets}</span>
            <span>Debt {MOCK_NET_WORTH.liabilities}</span>
          </div>
        </div>
        <div
          className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
          style={{ opacity: visible ? 1 : 0.4, transition: "opacity 700ms" }}
        >
          {(
            [
              { label: "Investments", ...MOCK_WEALTH_BREAKDOWN.investments },
              { label: "Property", ...MOCK_WEALTH_BREAKDOWN.property },
              { label: "Other", ...MOCK_WEALTH_BREAKDOWN.other },
              { label: "Liabilities", ...MOCK_WEALTH_BREAKDOWN.liabilities },
            ] as const
          ).map((item) => (
            <div key={item.label} className="rounded-md bg-muted/60 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-0.5 text-sm font-medium tabular-nums text-foreground">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </MockEditorialCard>
    </div>
  );
}
