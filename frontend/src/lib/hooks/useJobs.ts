"use client";

import { useCallback, useEffect, useState } from "react";
import type { Job, JobFilters } from "@/types/job";
import type { PaginatedData } from "@/constants/routes";
import { getJobs } from "@/lib/api/jobs";
import { getErrorMessage } from "@/lib/utils";

export function useJobs(filters: JobFilters = {}) {
  const [data, setData] = useState<PaginatedData<Job> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getJobs(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { data, isLoading, error, refetch: fetchJobs };
}
