"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getAdminDashboard, type AdminDashboard } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (error) return <p className="text-danger-text">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-muted">Platform overview and moderation queue</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </>
        ) : (
          <>
            <StatCard label="Total users" value={data?.summaryCards.totalUsers ?? 0} index={0} />
            <StatCard label="Pending companies" value={data?.summaryCards.pendingCompanyApprovals ?? 0} index={1} />
            <StatCard label="Pending jobs" value={data?.summaryCards.pendingJobApprovals ?? 0} index={2} />
            <StatCard label="Jobs this month" value={data?.summaryCards.jobsPostedThisMonth ?? 0} index={3} />
          </>
        )}
      </div>
      {isLoading && <PageLoader message="Loading dashboard..." className="py-8" />}
      {data && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold">Users by role</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {Object.entries(data.usersByRole).map(([role, count]) => (
              <StatCard key={role} label={role} value={count} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
