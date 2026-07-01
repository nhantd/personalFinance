import { BRAND, brandClasses } from "@/lib/brand";
import { MOCK_HERO_WEALTH, MOCK_INSIGHT, MOCK_READ, MOCK_STATEMENT } from "@/lib/marketing/mock-data";
import { MockTransactionList } from "@/components/marketing/mocks/mock-transaction-list";
import { cn } from "@/lib/utils";

export function HeroMockCard() {
  return (
    <div className={`${brandClasses.mockCard} overflow-hidden font-mono text-sm shadow-md`}>
      <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
        <span className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {MOCK_STATEMENT.filename} — {MOCK_STATEMENT.accountLabel}
        </span>
        <span className="flex shrink-0 items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wide text-accent">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          Reading
        </span>
      </div>

      <div className="px-4 py-3">
        <MockTransactionList animateRows />
      </div>

      <div className="border-t border-border bg-muted/30 px-4 py-4">
        <p className={brandClasses.label}>{BRAND.name}&apos;s read</p>
        <p
          className={`mt-3 rounded-md px-3 py-2 font-sans text-sm leading-relaxed text-foreground ${brandClasses.insightBg} opacity-0 animate-fade-up`}
          style={{ animationDelay: "600ms" }}
        >
          Net worth{" "}
          <span className="font-heading font-medium text-accent">{MOCK_HERO_WEALTH.netWorth}</span>
          {" · "}
          Liabilities{" "}
          <span className="font-semibold text-foreground">{MOCK_HERO_WEALTH.liabilities}</span>
          {" · "}
          Cash surplus{" "}
          <span className={`font-heading font-medium ${brandClasses.income}`}>
            {MOCK_HERO_WEALTH.cashSurplus}
          </span>{" "}
          in {MOCK_HERO_WEALTH.month}.{" "}
          <span className="font-semibold text-foreground">{MOCK_READ.categoryUp}</span> is up{" "}
          <span className="font-semibold text-highlight-warm">{MOCK_READ.categoryChangePct}</span> vs{" "}
          {MOCK_READ.compareMonth}.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Income", value: MOCK_INSIGHT.income, highlight: false },
            { label: "Outflows", value: MOCK_INSIGHT.outflows, highlight: false },
            { label: "Surplus", value: MOCK_INSIGHT.surplusFormatted, highlight: true },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-lg bg-card p-2.5 opacity-0 animate-fade-up"
              style={{ animationDelay: `${720 + i * 80}ms` }}
            >
              <p className="text-[10px] font-sans font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p
                className={cn(
                  "mt-0.5 font-sans text-base font-semibold",
                  stat.highlight ? `${brandClasses.income} font-heading font-medium` : "text-foreground"
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
