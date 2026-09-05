"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApplicationProfileCard } from "@/components/applications/ApplicationProfileCard";
import { ApplicationTimeline } from "@/components/applications/ApplicationTimeline";
import { Card } from "@/components/ui/Card";
import { Skeleton, FormSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getApplicationById } from "@/lib/api/applications";
import { getInterview } from "@/lib/api/interviews";
import type { Application } from "@/types/application";
import type { Interview } from "@/types/interview";
import { capitalize, formatDateTime, getErrorMessage } from "@/lib/utils";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getApplicationById(id),
      getInterview(id).catch(() => null),
    ])
      .then(([app, int]) => {
        setApplication(app);
        setInterview(int);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <FormSkeleton />
        <PageLoader message="Loading application..." />
      </div>
    );
  }

  if (error || !application) {
    return <p className="text-danger-text">{error || "Application not found"}</p>;
  }

  const job = typeof application.job === "object" ? application.job : null;

  return (
    <div>
      <Link href="/applications" className="text-sm text-muted hover:text-accent">
        ← Back to applications
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold">{job?.title || "Application"}</h1>
      <p className="mt-1 text-muted">Submitted {formatDateTime(application.appliedAt)}</p>

      <Card className="mt-6 p-6">
        <ApplicationTimeline status={application.status} appliedAt={application.appliedAt} />
      </Card>

      <div className="mt-6">
        <ApplicationProfileCard application={application} />
      </div>

      {application.coverNote && (
        <Card className="mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">Cover letter</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {application.coverNote}
          </p>
        </Card>
      )}

      {interview && (
        <Card className="mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">Interview</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex gap-2">
              <dt className="text-muted">Scheduled:</dt>
              <dd className="font-medium">{formatDateTime(interview.scheduledAt)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted">Mode:</dt>
              <dd className="font-medium capitalize">{interview.mode}</dd>
            </div>
            {interview.meetingDetails && (
              <div className="flex gap-2">
                <dt className="text-muted">Details:</dt>
                <dd>{interview.meetingDetails}</dd>
              </div>
            )}
            {interview.notes && (
              <div className="flex gap-2">
                <dt className="text-muted">Notes:</dt>
                <dd>{interview.notes}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}

      {job && (
        <Card className="mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">Job details</h2>
          <p className="mt-2 text-sm text-muted">
            {capitalize(job.type)} · {capitalize(job.workMode)}
          </p>
          <Link href={`/jobs/${job._id}`} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
            View job posting →
          </Link>
        </Card>
      )}
    </div>
  );
}
