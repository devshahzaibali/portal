"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "muted" | "success" | "warning" | "danger";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface text-foreground border-border",
  accent: "bg-accent/10 text-accent border-accent/25",
  muted: "bg-surface-hover text-muted border-border",
  success: "bg-success-bg text-success-text border-success-border",
  warning: "bg-warning-bg text-warning-text border-warning-border",
  danger: "bg-danger-bg text-danger-text border-danger-border",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </motion.span>
  );
}
