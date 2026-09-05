"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getAdminJobs } from "@/lib/api/admin";
import { approveJob } from "@/lib/api/jobs";
import type { Job } from "@/types/job";
import { capitalize, getErrorMessage } from "@/lib/utils";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchJobs = () => {
    setIsLoading(true);
    getAdminJobs(filter === "all" ? undefined : filter)
      .then(setJobs)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchJobs(); }, [filter]);

  const handleApprove = async (id: string, status: "approved" | "rejected") => {
    setActionId(id);
    setError("");
    try {
      await approveJob(id, status);
      fetchJobs();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Jobs</h1>
      <p className="mt-2 text-muted">Review and approve job postings</p>
      <div className="mt-4 flex gap-2">
        {["pending", "approved", "rejected", "all"].map((f) => (
          <Button key={f} variant={filter === f ? "primary" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-danger-text">{error}</p>}
      {isLoading ? (
        <div className="mt-8 space-y-4">
          <JobCardSkeleton />
          <PageLoader message="Loading jobs..." className="py-6" />
        </div>
      ) : jobs.length === 0 ? (
        <p className="mt-8 text-muted">No jobs found</p>
      ) : (
        <div className="mt-8">
          <Table>
            <TableHead>
              <TableHeader>Title</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{capitalize(job.type)}</TableCell>
                  <TableCell><Badge variant={job.status === "approved" ? "success" : "warning"}>{job.status}</Badge></TableCell>
                  <TableCell>
                    {job.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(job._id, "approved")}
                          isLoading={actionId === job._id}
                          loadingText="..."
                          disabled={!!actionId}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(job._id, "rejected")}
                          disabled={!!actionId}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
