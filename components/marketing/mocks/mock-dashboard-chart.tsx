import { brandClasses } from "@/lib/brand";
import { MOCK_CATEGORIES } from "@/lib/marketing/mock-data";

export function MockDashboardChart() {
  return (
    <div className={`${brandClasses.card} p-4`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Spending by category
      </p>
      <div className="mt-4 space-y-3">
        {MOCK_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-foreground">{cat.name}</span>
              <span className="text-muted-foreground">${cat.amount}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${cat.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
