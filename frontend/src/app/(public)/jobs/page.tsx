"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { Button } from "@/components/ui/Button";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { useJobs } from "@/lib/hooks/useJobs";
import type { JobFilters as JobFiltersType } from "@/types/job";

function JobsContent() {
  const searchParams = useSearchParams();
  const filters: JobFiltersType = {
    keyword: searchParams.get("keyword") || undefined,
    location: searchParams.get("location") || undefined,
    workMode: (searchParams.get("workMode") as JobFiltersType["workMode"]) || undefined,
    type: (searchParams.get("type") as JobFiltersType["type"]) || undefined,
    skills: searchParams.get("skills") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
  };

  const { data, isLoading, error } = useJobs(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Photographic Editorial Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-950 px-6 py-12 sm:px-10 sm:py-16 shadow-xl"
      >
        {/* Photographic Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-700"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85")`,
            }}
          />
          {/* Deep Dark Multi-Stop Gradient for Maximum Crispness */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/70" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/90">
              Open Roles Directory
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
            Find jobs &amp; internships
          </h1>
          <p className="mt-3 text-sm sm:text-base font-normal leading-relaxed text-zinc-300 max-w-xl">
            Browse verified openings from leading startups and tech companies with upfront compensation.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-300">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Verified companies</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="text-orange-400 font-bold">✓</span>
              <span>Direct applications</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Upfront salary ranges</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-10">
        <JobFilters />

        {error && (
          <div className="mt-8 rounded-2xl border border-danger-border bg-danger-bg p-4 text-sm text-danger-text">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
            <PageLoader message="Loading jobs..." className="py-8" />
          </div>
        ) : data?.results.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="font-display text-lg font-bold">No jobs found</p>
            <p className="mt-2 text-sm text-muted">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <motion.ul
              className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {data?.results.map((job, i) => (
                <li key={job._id}>
                  <JobCard job={job} index={i} />
                </li>
              ))}
            </motion.ul>

            {data && data.totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                  <a key={page} href={`/jobs?page=${page}`}>
                    <Button variant={page === data.page ? "primary" : "outline"} size="sm">
                      {page}
                    </Button>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}
