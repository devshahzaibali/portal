"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

const sizeMap: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

export function Spinner({ size = "md", className, label = "Loading" }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <span
        className={cn(
          "animate-spin rounded-full border-accent/25 border-t-accent",
          sizeMap[size]
        )}
      />
    </span>
  );
}

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({ message = "Loading...", className }: PageLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex flex-col items-center justify-center gap-4 py-20", className)}
    >
      <Spinner size="lg" />
      <p className="text-sm font-medium text-muted">{message}</p>
    </motion.div>
  );
}

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

export function LoadingOverlay({ show, message = "Please wait..." }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-surface/80 backdrop-blur-sm"
    >
      <Spinner size="lg" />
      <p className="text-sm font-medium text-muted">{message}</p>
    </motion.div>
  );
}
