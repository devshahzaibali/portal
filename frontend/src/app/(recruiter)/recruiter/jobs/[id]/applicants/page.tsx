"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { ListItemSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getJobApplications } from "@/lib/api/jobs";
import type { Application } from "@/types/application";
import { getErrorMessage } from "@/lib/utils";

export default function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobApplications(id)
      .then((data) => setApplicants(data.results))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Applicants</h1>
      <p className="mt-2 text-muted">Review candidates for this position</p>
      {error && <p className="mt-4 text-sm text-danger-text">{error}</p>}
      {isLoading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
          <PageLoader message="Loading applicants..." className="py-6" />
        </div>
      ) : applicants.length === 0 ? (
        <p className="mt-8 text-muted">No applicants yet</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {applicants.map((app) => {
            const candidate = typeof app.candidate === "object" ? app.candidate : null;
            const name = app.fullName || candidate?.name || "Candidate";
            const email = app.email || candidate?.email;
            return (
              <li key={app._id}>
                <Link
                  href={`/applicants/${app._id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft"
                >
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted">{email}</p>
                    {app.currentRole && (
                      <p className="mt-1 text-xs text-muted">{app.currentRole}</p>
                    )}
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
