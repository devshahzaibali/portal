"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientMeshProps {
  className?: string;
}

export function GradientMesh({ className }: GradientMeshProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="animate-mesh absolute -right-[15%] -top-[20%] h-[700px] w-[700px] rounded-full opacity-80"
        style={{ background: "radial-gradient(circle, var(--mesh-orange) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="animate-mesh absolute -bottom-[20%] -left-[10%] h-[600px] w-[600px] rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, var(--mesh-amber) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.05, 1], rotate: [0, -4, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)",
        }}
      />
    </div>
  );
}
