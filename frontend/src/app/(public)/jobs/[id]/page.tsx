"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ApplyModal } from "@/components/jobs/ApplyModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { useAuth } from "@/lib/auth/useAuth";
import { getJobById } from "@/lib/api/jobs";
import type { Job } from "@/types/job";
import { capitalize, formatDate, formatSalary, getErrorMessage } from "@/lib/utils";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    getJobById(id)
      .then(setJob)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleApplyClick = () => {
    if (!user) {
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }
    if (user.role !== "candidate") {
      setError("Only candidates can apply to jobs.");
      return;
    }
    setShowApply(true);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Skeleton className="mb-6 h-6 w-32" />
        <Skeleton className="h-56 w-full rounded-3xl" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-48 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <PageLoader message="Loading job details..." className="py-8" />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-danger-text">{error}</p>
        <Link href="/jobs" className="mt-4 inline-block text-accent hover:underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  if (!job) return null;

  const company = typeof job.company === "object" ? job.company : null;

  return (
    <div className="pb-16">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent">
            ← Back to jobs
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-5xl px-4 sm:px-6"
      >
        <div className="relative -mt-2 overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-xl">
          {/* Photographic Brand Cover Banner */}
          <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-zinc-900">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                Verified Listing
              </span>
            </div>
          </div>

          <div className="relative px-6 sm:px-8 lg:px-10 pb-8 sm:pb-10">
            {/* Overlapping Company Avatar */}
            <div className="-mt-12 mb-5 flex items-end justify-between">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-orange-500 font-display text-2xl font-black text-white shadow-lg">
                {(company?.name || "CO")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{capitalize(job.type)}</Badge>
                  <Badge>{capitalize(job.workMode)}</Badge>
                  {job.location && <Badge variant="muted">{job.location}</Badge>}
                </div>
                <h1 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900">
                  {job.title}
                </h1>
                <p className="mt-1 text-base font-semibold text-zinc-600">{company?.name || "Triad Labz"}</p>
                <div className="mt-5 flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-muted">Salary</p>
                  <p className="mt-1 font-semibold">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                </div>
                <div>
                  <p className="text-muted">Deadline</p>
                  <p className="mt-1 font-semibold">{formatDate(job.deadline)}</p>
                </div>
              </div>
            </div>

            <div className="shrink-0 lg:w-64">
              {applied ? (
                <div className="rounded-xl border border-accent/30 bg-accent/5 px-5 py-4 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-accent">Application submitted!</p>
                  <p className="mt-1 text-xs text-muted">Track progress in your dashboard</p>
                  <Link href="/applications" className="mt-3 inline-block text-xs font-medium text-accent hover:underline">
                    View applications →
                  </Link>
                </div>
              ) : (
                <Button onClick={handleApplyClick} size="lg" className="w-full">
                  Apply now
                </Button>
              )}
            </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">About this role</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {job.description}
              </p>
            </Card>

            {job.skills?.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold">Required skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="accent">{skill}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-display text-base font-semibold">Quick facts</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex justify-between gap-4">
                  <span className="text-muted">Type</span>
                  <span className="font-medium">{capitalize(job.type)}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-muted">Work mode</span>
                  <span className="font-medium">{capitalize(job.workMode)}</span>
                </li>
                {job.location && (
                  <li className="flex justify-between gap-4">
                    <span className="text-muted">Location</span>
                    <span className="font-medium text-right">{job.location}</span>
                  </li>
                )}
                <li className="flex justify-between gap-4">
                  <span className="text-muted">Apply by</span>
                  <span className="font-medium">{formatDate(job.deadline)}</span>
                </li>
              </ul>
            </Card>

            <Card className="border-accent/20 bg-accent/5 p-6">
              <h3 className="font-display text-base font-semibold">Application tips</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
                <li>• Tailor your cover letter to this specific role</li>
                <li>• Upload a PDF resume or share a public link</li>
                <li>• Include your portfolio if relevant</li>
              </ul>
            </Card>
          </div>
        </div>
      </motion.div>

      <ApplyModal
        isOpen={showApply}
        onClose={() => setShowApply(false)}
        jobId={job._id}
        jobTitle={job.title}
        companyName={company?.name}
        onSuccess={() => setApplied(true)}
      />
    </div>
  );
}
