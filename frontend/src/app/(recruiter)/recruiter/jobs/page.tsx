"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getJobById, getMyJobs } from "@/lib/api/jobs";
import { getStoredJobIds } from "@/lib/recruiterJobs";
import type { Job } from "@/types/job";
import { capitalize, formatDate, getErrorMessage } from "@/lib/utils";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyJobs()
      .then((serverJobs) => {
        if (serverJobs && serverJobs.length > 0) {
          setJobs(serverJobs);
          setIsLoading(false);
          return;
        }
        // Fallback to stored IDs if server returned empty
        const ids = getStoredJobIds();
        if (ids.length === 0) {
          setJobs([]);
          setIsLoading(false);
          return;
        }
        Promise.all(ids.map((id) => getJobById(id).catch(() => null)))
          .then((results) => setJobs(results.filter(Boolean) as Job[]))
          .catch((err) => setError(getErrorMessage(err)))
          .finally(() => setIsLoading(false));
      })
      .catch(() => {
        // Fallback if getMyJobs failed
        const ids = getStoredJobIds();
        if (ids.length === 0) {
          setJobs([]);
          setIsLoading(false);
          return;
        }
        Promise.all(ids.map((id) => getJobById(id).catch(() => null)))
          .then((results) => setJobs(results.filter(Boolean) as Job[]))
          .catch((err) => setError(getErrorMessage(err)))
          .finally(() => setIsLoading(false));
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">My Jobs</h1>
          <p className="mt-2 text-muted">Manage your job listings</p>
        </div>
        <Link href="/recruiter/jobs/new">
          <Button>Post new job</Button>
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-danger-text">{error}</p>}

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
          <PageLoader message="Loading jobs..." className="py-6" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-muted">No approved jobs yet</p>
          <p className="mt-1 text-sm text-muted">New jobs appear here once approved by admin</p>
          <Link href="/recruiter/jobs/new" className="mt-4 inline-block">
            <Button>Post a job</Button>
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {jobs.map((job) => (
            <li key={job._id} className="flex items-center justify-between rounded-md border border-border p-4">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted">{capitalize(job.type)} · Deadline {formatDate(job.deadline)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={job.status === "approved" ? "success" : "warning"}>{job.status}</Badge>
                <Link href={`/recruiter/jobs/${job._id}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <Link href={`/recruiter/jobs/${job._id}/applicants`}>
                  <Button variant="ghost" size="sm">Applicants</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
