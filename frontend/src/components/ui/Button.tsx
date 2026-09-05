"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-orange text-white border border-orange-500/80 shadow-soft hover:shadow-glow hover:brightness-105 active:brightness-95",
  secondary: "bg-navy text-white border border-border hover:bg-surface-hover hover:text-foreground",
  outline:
    "bg-surface/80 backdrop-blur-sm text-foreground border border-border hover:border-accent hover:text-accent hover:bg-accent/5 hover:shadow-soft",
  ghost: "bg-transparent text-foreground hover:bg-surface-hover hover:text-accent border border-transparent",
  danger: "bg-danger-text text-white hover:opacity-90 border border-danger-text",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

const spinnerSizes: Record<ButtonSize, "sm" | "md"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, loadingText, children, disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03, y: disabled || isLoading ? 0 : -1 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {variant === "primary" && !disabled && !isLoading && (
        <span aria-hidden className="animate-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity hover:opacity-100" />
      )}
      {isLoading && <Spinner size={spinnerSizes[size]} className="relative shrink-0" />}
      <span className="relative">{isLoading ? (loadingText ?? "Loading...") : children}</span>
    </motion.button>
  )
);

Button.displayName = "Button";
