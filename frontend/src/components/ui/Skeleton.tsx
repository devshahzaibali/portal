import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse-flat rounded-xl bg-border/70", className)}
      aria-hidden
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </div>
      <div className="space-y-3 px-5 py-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card space-y-3">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-9 w-1/3" />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-card">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
