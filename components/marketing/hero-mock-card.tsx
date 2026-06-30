import { BRAND, brandClasses } from "@/lib/brand";
import { MOCK_INSIGHT } from "@/lib/marketing/mock-data";
import { MockTransactionList } from "@/components/marketing/mocks/mock-transaction-list";
import { cn } from "@/lib/utils";

export function HeroMockCard() {
  return (
    <div className={`${brandClasses.card} overflow-hidden font-mono text-sm shadow-md`}>
      <div className="flex items-center justify-end border-b border-border px-4 py-3">
        <span className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wide text-accent">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          Reading
        </span>
      </div>

      <div className="px-4 py-3">
        <MockTransactionList />
      </div>

      <div className="border-t border-border bg-muted/30 px-4 py-4">
        <p className={brandClasses.label}>{BRAND.name}&apos;s read</p>
        <p className="mt-3 rounded-md bg-accent/10 px-3 py-2 font-sans text-sm leading-relaxed text-foreground">
          Surplus of{" "}
          <span className={`font-semibold ${brandClasses.income}`}>{MOCK_INSIGHT.surplus}</span> this
          month. Netflix crept <span className="font-semibold text-accent">▲28%</span>. Holiday fund
          is <span className="font-semibold text-primary">24% funded</span>.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Income", value: MOCK_INSIGHT.income, highlight: false },
            { label: "Outflows", value: MOCK_INSIGHT.outflows, highlight: false },
            { label: "Surplus", value: MOCK_INSIGHT.surplusFormatted, highlight: true },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-card p-2.5">
              <p className="text-[10px] font-sans font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p
                className={cn(
                  "mt-0.5 font-sans text-base font-semibold",
                  stat.highlight ? brandClasses.income : "text-foreground"
                )}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
