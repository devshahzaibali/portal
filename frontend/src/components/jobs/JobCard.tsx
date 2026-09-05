"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { capitalize, formatDate, formatSalary } from "@/lib/utils";
import type { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const company = typeof job.company === "object" ? job.company : null;
  const companyName = company?.name || "Verified Employer";
  const initials = companyName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link href={`/jobs/${job._id}`} className="block h-full">
        <AnimatedCard className="group flex h-full flex-col justify-between overflow-hidden p-0 border border-zinc-200/90 transition-all duration-200 hover:border-orange-500/50 hover:shadow-md">
          <div className="border-b border-zinc-100 bg-stone-50/50 px-5 py-4 transition-colors group-hover:bg-orange-50/30">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 font-display font-black text-orange-600 text-xs border border-orange-200/50">
                  {initials}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-zinc-900 transition-colors group-hover:text-orange-600 leading-snug">
                    {job.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500 font-medium flex items-center gap-1">
                    <span>{companyName}</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-zinc-300" />
                    <span className="text-zinc-400">{capitalize(job.workMode)}</span>
                  </p>
                </div>
              </div>
              <Badge variant="accent" className="shrink-0 text-[11px] font-bold">
                {capitalize(job.type)}
              </Badge>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600">
              {job.description}
            </p>

            <div className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                {job.location && (
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                    📍 {job.location}
                  </span>
                )}
                {job.skills?.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                <span className="font-display font-extrabold text-orange-600">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span className="font-semibold text-zinc-500 group-hover:text-orange-600 transition-colors flex items-center gap-1">
                  View Role &rarr;
                </span>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </Link>
    </motion.div>
  );
}
