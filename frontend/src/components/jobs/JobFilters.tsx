"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/Button";
import type { JobFilters as JobFiltersType, JobType, WorkMode } from "@/types/job";

const workModeOptions = [
  { value: "", label: "All Work Modes" },
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
];

const typeOptions = [
  { value: "", label: "All Employment Types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
];

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentKeyword = searchParams.get("keyword") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentSkills = searchParams.get("skills") || "";
  const currentWorkMode = searchParams.get("workMode") || "";
  const currentType = searchParams.get("type") || "";

  const hasActiveFilters = Boolean(
    currentKeyword || currentLocation || currentSkills || currentWorkMode || currentType
  );

  const updateFilters = useCallback(
    (updates: Partial<JobFiltersType>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
        else params.delete(key);
      });
      params.delete("page");
      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams]
  );

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/jobs");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateFilters({
      keyword: (formData.get("keyword") as string)?.trim(),
      location: (formData.get("location") as string)?.trim(),
      workMode: (formData.get("workMode") as WorkMode) || undefined,
      type: (formData.get("type") as JobType) || undefined,
      skills: (formData.get("skills") as string)?.trim(),
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header with Title & Reset */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
          <span className="font-display text-sm font-bold text-zinc-900">
            Search & Filter Opportunities
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors flex items-center gap-1"
          >
            <span>Reset filters</span>
            <span>✕</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {/* Keyword Field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Keyword
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                name="keyword"
                placeholder="Title, company, role"
                defaultValue={currentKeyword}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Location
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              <input
                name="location"
                placeholder="City, state, or remote"
                defaultValue={currentLocation}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
          </div>

          {/* Skills Field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Skills
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </span>
              <input
                name="skills"
                placeholder="e.g. React, Python"
                defaultValue={currentSkills}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
          </div>

          {/* Work Mode Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Work Mode
            </label>
            <select
              name="workMode"
              defaultValue={currentWorkMode}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 text-xs text-zinc-900 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/15"
            >
              {workModeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Employment Type
            </label>
            <select
              name="type"
              defaultValue={currentType}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 text-xs text-zinc-900 transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/15"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            size="sm"
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-sm shadow-orange-600/20 px-5"
          >
            Apply Filters
          </Button>
        </div>
      </form>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-zinc-400">Active filters:</span>
          {currentKeyword && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">
              Keyword: &ldquo;{currentKeyword}&rdquo;
              <button
                type="button"
                onClick={() => removeFilter("keyword")}
                className="hover:text-orange-900 transition-colors ml-0.5"
                aria-label="Remove keyword filter"
              >
                ✕
              </button>
            </span>
          )}
          {currentLocation && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">
              Location: &ldquo;{currentLocation}&rdquo;
              <button
                type="button"
                onClick={() => removeFilter("location")}
                className="hover:text-orange-900 transition-colors ml-0.5"
                aria-label="Remove location filter"
              >
                ✕
              </button>
            </span>
          )}
          {currentSkills && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">
              Skills: &ldquo;{currentSkills}&rdquo;
              <button
                type="button"
                onClick={() => removeFilter("skills")}
                className="hover:text-orange-900 transition-colors ml-0.5"
                aria-label="Remove skills filter"
              >
                ✕
              </button>
            </span>
          )}
          {currentWorkMode && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 capitalize">
              Mode: {currentWorkMode}
              <button
                type="button"
                onClick={() => removeFilter("workMode")}
                className="hover:text-orange-900 transition-colors ml-0.5"
                aria-label="Remove work mode filter"
              >
                ✕
              </button>
            </span>
          )}
          {currentType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 capitalize">
              Type: {currentType}
              <button
                type="button"
                onClick={() => removeFilter("type")}
                className="hover:text-orange-900 transition-colors ml-0.5"
                aria-label="Remove type filter"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
