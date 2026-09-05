"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function BrandLogo({ className = "", size = "md", showText = true }: BrandLogoProps) {
  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 transition-transform ${className}`}>
      {/* Official Uploaded Logo Emblem */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 1.5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={`relative ${iconSizes[size]} shrink-0 drop-shadow-md`}
      >
        <img
          src="/logo-icon.png"
          alt="Portal Logo"
          className="h-full w-full object-contain"
        />
      </motion.div>

      {showText && (
        <span className={`font-display ${textSizes[size]} font-extrabold tracking-tight text-zinc-900`}>
          PORTAL<span className="text-orange-500">.</span>
        </span>
      )}
    </Link>
  );
}
