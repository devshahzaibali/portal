"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GlobalLoadingBar } from "@/components/layout/GlobalLoadingBar";
import { subscribeLoading } from "@/lib/api/loadingManager";

interface LoadingContextValue {
  isGlobalLoading: boolean;
  activeRequestCount: number;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [activeRequestCount, setActiveRequestCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeLoading(setActiveRequestCount);
    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      isGlobalLoading: activeRequestCount > 0,
      activeRequestCount,
    }),
    [activeRequestCount]
  );

  return (
    <LoadingContext.Provider value={value}>
      <GlobalLoadingBar />
      {children}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useGlobalLoading must be used within LoadingProvider");
  return ctx;
}
