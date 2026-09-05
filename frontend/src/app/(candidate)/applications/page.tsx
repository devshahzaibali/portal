"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { ListItemSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { useApplications } from "@/lib/hooks/useApplications";
import { formatDate } from "@/lib/utils";

export default function ApplicationsPage() {
  const { data, isLoading, error } = useApplications();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">My applications</h1>
      <p className="mt-2 text-muted">Track all your job applications</p>

      {error && <p className="mt-4 text-sm text-danger-text">{error}</p>}

      {isLoading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
          <PageLoader message="Loading applications..." className="py-6" />
        </div>
      ) : data?.results.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-muted">No applications yet</p>
          <Link href="/jobs" className="mt-2 inline-block text-accent hover:underline">
            Browse jobs
          </Link>
        </div>
      ) : (
        <motion.ul
          className="mt-8 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {data?.results.map((app, i) => {
            const job = typeof app.job === "object" ? app.job : null;
            return (
              <motion.li
                key={app._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/applications/${app._id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft"
                >
                  <div>
                    <p className="font-medium">{job?.title || "Job"}</p>
                    <p className="text-sm text-muted">
                      {typeof job?.company === "object" ? job.company.name : ""} · Applied {formatDate(app.appliedAt)}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}
