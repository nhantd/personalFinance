import { brandClasses } from "@/lib/brand";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageHeaderSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {action && <Skeleton className="h-9 w-32 rounded-lg" />}
    </div>
  );
}

export function FilterToolbarSkeleton() {
  return (
    <div className={cn(brandClasses.mockCard, "p-3")}>
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 flex-1 min-w-[120px] rounded-lg" />
      </div>
    </div>
  );
}

export function EditorialCardSkeleton({
  className,
  chart = false,
  rows = 3,
  stat = false,
}: {
  className?: string;
  chart?: boolean;
  rows?: number;
  stat?: boolean;
}) {
  return (
    <div className={cn(brandClasses.mockCard, "overflow-hidden", className)}>
      <div className={cn(brandClasses.mockCardHeader, "py-2.5")}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="space-y-3 p-4">
        {stat && <Skeleton className="h-10 w-40" />}
        {chart ? (
          <Skeleton className="h-56 w-full rounded-lg sm:h-64" />
        ) : (
          Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" style={{ width: `${92 - i * 8}%` }} />
          ))
        )}
      </div>
    </div>
  );
}

export function StatGridSkeleton() {
  return (
    <div className={cn(brandClasses.mockCard, "overflow-hidden")}>
      <div className={cn(brandClasses.mockCardHeader, "py-2.5")}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="p-4">
        <StatGridSkeletonInner />
      </div>
    </div>
  );
}

function StatGridSkeletonInner() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function PeriodHeroSkeleton() {
  return (
    <div className={cn(brandClasses.mockCard, "overflow-hidden")}>
      <div className={cn(brandClasses.mockCardHeader, "py-2.5")}>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-14" />
      </div>
      <div className="p-4">
        <StatGridSkeletonInner />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className={cn(brandClasses.mockCard, "overflow-hidden")}>
      <div className={cn(brandClasses.mockCardHeader, "py-2.5")}>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="space-y-0 p-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-border/40 px-2 py-3 last:border-0"
          >
            <Skeleton className="h-3 w-20 shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetContentSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PeriodHeroSkeleton />
      <EditorialCardSkeleton chart />
    </div>
  );
}

export function TransactionsContentSkeleton() {
  return (
    <div className="animate-in fade-in duration-200">
      <TableSkeleton rows={10} />
    </div>
  );
}

export function SpendingBodySkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PeriodHeroSkeleton />
      <div className="grid gap-6 lg:grid-cols-2">
        <EditorialCardSkeleton chart />
        <EditorialCardSkeleton chart />
      </div>
      <EditorialCardSkeleton chart rows={4} />
      <TableSkeleton rows={5} />
    </div>
  );
}

export function FinanceContentSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <FilterToolbarSkeleton />
      <SpendingBodySkeleton />
    </div>
  );
}

export function SpendingPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action />
      <FinanceContentSkeleton />
    </div>
  );
}

export function BudgetPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <FinanceContentSkeleton />
    </div>
  );
}

export function TransactionsPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action />
      <FilterToolbarSkeleton />
      <TableSkeleton rows={10} />
    </div>
  );
}

export function WealthPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action />
      <EditorialCardSkeleton stat />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <EditorialCardSkeleton key={i} stat rows={1} />
        ))}
      </div>
      <EditorialCardSkeleton chart />
      <EditorialCardSkeleton rows={4} />
    </div>
  );
}

export function InvestmentsPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action />
      <EditorialCardSkeleton stat />
      <EditorialCardSkeleton rows={5} />
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <EditorialCardSkeleton rows={5} />
      <EditorialCardSkeleton rows={2} />
      <EditorialCardSkeleton rows={3} />
      <EditorialCardSkeleton rows={4} />
    </div>
  );
}

export function UploadPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <EditorialCardSkeleton rows={5} className="max-w-lg" />
    </div>
  );
}

export function AppPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <EditorialCardSkeleton chart />
      <EditorialCardSkeleton rows={4} />
    </div>
  );
}
