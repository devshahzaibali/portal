"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  mode?: "login" | "register";
  title?: string;
  subtitle?: string;
}

const HERO_ARTWORK = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85";

export function AuthSplitLayout({ children, mode = "login" }: AuthSplitLayoutProps) {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] w-full bg-[#f8fafc] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2 bg-cover bg-left bg-no-repeat opacity-15"
        style={{ backgroundImage: `url("${HERO_ARTWORK}")` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#f8fafc]/90 to-[#f8fafc]"
      />

      {/* Main Floating Rounded Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[960px] bg-white rounded-3xl sm:rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.07)] border border-zinc-200/80 overflow-hidden flex flex-col md:flex-row my-auto"
      >
        {/* Left Side: Creative Artwork Sub-Card */}
        <div className="m-3 sm:m-3.5 md:m-4 rounded-2xl sm:rounded-[24px] overflow-hidden relative flex flex-col justify-between p-7 sm:p-9 min-h-[380px] md:min-h-[540px] md:w-[46%] lg:w-[45%] bg-zinc-950 shrink-0 select-none">
          {/* Background Artwork */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url("${HERO_ARTWORK}")` }}
          />

          {/* Deep Dark Multi-Stop Contrast Gradient Overlay */}
          <div className="absolute inset-0 z-1 bg-gradient-to-t from-black/90 via-black/45 to-black/60 pointer-events-none" />

          {/* Top Bar inside Left Artwork */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-bold text-white/90 tracking-wide uppercase">
              Career Hub
            </span>

            <div className="flex items-center gap-2">
              {mode === "login" ? (
                <Link
                  href="/register"
                  className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
                >
                  Join Us
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Content inside Left Artwork */}
          <div className="relative z-10 space-y-2 pt-6 border-t border-white/15">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/90">
                Active Listings
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
              Find internships and roles at top tech companies.
            </h3>
            <p className="text-xs text-zinc-300 font-normal leading-relaxed max-w-xs">
              Direct applications to hiring managers with transparent compensation and real status updates.
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center flex-1">
          {/* Form Content Body */}
          <div className="w-full max-w-sm mx-auto">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
