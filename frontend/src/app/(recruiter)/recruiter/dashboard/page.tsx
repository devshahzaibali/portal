"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { ListItemSkeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getRecruiterDashboard, type RecruiterDashboard } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/utils";

export default function RecruiterDashboardPage() {
  const [data, setData] = useState<RecruiterDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRecruiterDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (error) return <p className="text-danger-text">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Recruiter Dashboard</h1>
      <p className="mt-2 text-muted">Overview of your jobs and applicants</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total jobs" value={data?.summaryCards.totalJobs ?? 0} index={0} />
            <StatCard label="Total applicants" value={data?.summaryCards.totalApplicants ?? 0} index={1} />
            <StatCard label="Active pipeline" value={data?.summaryCards.activeShortlisted ?? 0} index={2} />
            <StatCard label="Hired" value={data?.summaryCards.hired ?? 0} index={3} />
          </>
        )}
      </div>
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Recent applicants</h2>
        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
            <PageLoader message="Loading dashboard..." className="py-4" />
          </div>
        ) : data?.recentApplicants.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No applicants yet</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {data?.recentApplicants.map((app) => {
              const job = typeof app.job === "object" ? app.job : null;
              const candidate = typeof app.candidate === "object" ? app.candidate : null;
              return (
                <li key={app._id}>
                  <Link href={`/applicants/${app._id}`} className="flex items-center justify-between rounded-md border border-border p-4 hover:shadow-soft transition-shadow">
                    <div>
                      <p className="font-medium">{candidate?.name || "Candidate"}</p>
                      <p className="text-sm text-muted">{job?.title}</p>
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
