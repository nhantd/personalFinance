"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "@/lib/colors";
import { MOCK_NET_WORTH, MOCK_NET_WORTH_HISTORY } from "@/lib/marketing/mock-data";

export function MockNetWorthChart() {
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
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-xl border border-foreground/10 bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Net worth today
          </p>
          <p className="mt-1 font-sans text-3xl font-semibold tabular-nums tracking-normal text-foreground sm:text-4xl">
            {MOCK_NET_WORTH.total}
          </p>
          <p className="mt-1 text-xs text-success">
            {MOCK_NET_WORTH.change} {MOCK_NET_WORTH.changeLabel}
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Assets
            </p>
            <p className="mt-0.5 font-medium tabular-nums text-foreground">{MOCK_NET_WORTH.assets}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Liabilities
            </p>
            <p className="mt-0.5 font-medium tabular-nums text-foreground">{MOCK_NET_WORTH.liabilities}</p>
          </div>
        </div>
      </div>

      <div
        className="mt-6 h-56 transition-opacity duration-700 sm:h-64"
        style={{ opacity: animate ? 1 : 0.3 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={[...MOCK_NET_WORTH_HISTORY]}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
              width={40}
            />
            <Bar
              dataKey="assets"
              fill={COLORS.mint}
              radius={[4, 4, 0, 0]}
              opacity={0.35}
            />
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke={COLORS.forest}
              strokeWidth={2}
              dot={{ r: 2, fill: COLORS.forest }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
