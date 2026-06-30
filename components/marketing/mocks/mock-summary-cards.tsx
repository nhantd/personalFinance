import { brandClasses } from "@/lib/brand";
import { MOCK_INSIGHT } from "@/lib/marketing/mock-data";
import { cn } from "@/lib/utils";

export function MockSummaryCards() {
  const stats = [
    { label: "Income", value: MOCK_INSIGHT.income, highlight: false },
    { label: "Outflows", value: MOCK_INSIGHT.outflows, highlight: false },
    { label: "Surplus", value: MOCK_INSIGHT.surplusFormatted, highlight: true },
  ];

  return (
    <div className={`${brandClasses.card} grid grid-cols-3 gap-3 p-4`}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg bg-muted/60 p-3 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {stat.label}
          </p>
          <p
            className={cn(
              "mt-1 text-lg font-semibold",
              stat.highlight ? brandClasses.income : "text-foreground"
            )}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
