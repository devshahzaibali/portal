"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { ListItemSkeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getCandidateDashboard, type CandidateDashboard } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/utils";

export default function CandidateDashboardPage() {
  const [data, setData] = useState<CandidateDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCandidateDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (error) return <p className="text-danger-text">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted">Track your application progress</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total applications" value={data?.summaryCards.totalApplications ?? 0} index={0} />
            <StatCard label="Shortlisted" value={data?.summaryCards.shortlisted ?? 0} index={1} />
            <StatCard label="Interviews" value={data?.summaryCards.interviewsScheduled ?? 0} index={2} />
            <StatCard label="Offers" value={data?.summaryCards.offersReceived ?? 0} index={3} />
          </>
        )}
      </div>
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Recent applications</h2>
        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
            <PageLoader message="Loading dashboard..." className="py-4" />
          </div>
        ) : data?.recentApplications.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No applications yet. <Link href="/jobs" className="text-accent hover:underline">Browse jobs</Link></p>
        ) : (
          <ul className="mt-4 space-y-3">
            {data?.recentApplications.map((app) => {
              const job = typeof app.job === "object" ? app.job : null;
              return (
                <li key={app._id}>
                  <Link href={`/applications/${app._id}`} className="flex items-center justify-between rounded-md border border-border p-4 hover:shadow-soft transition-shadow">
                    <div>
                      <p className="font-medium">{job?.title || "Job"}</p>
                      <p className="text-sm text-muted">{typeof job?.company === "object" ? job.company.name : ""}</p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
