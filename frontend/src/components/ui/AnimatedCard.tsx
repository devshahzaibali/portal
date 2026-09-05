"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHover } from "@/lib/motion";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function AnimatedCard({ children, className, hover = true, glow, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover={hover ? "hover" : undefined}
      variants={hover ? cardHover : undefined}
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-card transition-shadow duration-300",
        hover && "hover:border-accent/20 hover:shadow-card-hover",
        glow && "shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
