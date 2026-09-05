"use client";

import { useCallback, useEffect, useState } from "react";
import type { Application } from "@/types/application";
import type { PaginatedData } from "@/constants/routes";
import { getMyApplications } from "@/lib/api/applications";
import { getErrorMessage } from "@/lib/utils";

export function useApplications(page = 1, limit = 10) {
  const [data, setData] = useState<PaginatedData<Application> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getMyApplications(page, limit);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { data, isLoading, error, refetch: fetchApplications };
}
