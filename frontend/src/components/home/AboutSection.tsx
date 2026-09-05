"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { slideInLeft, slideInRight, staggerContainer, viewportOnce } from "@/lib/motion";

const PILLARS = [
  {
    title: "Upfront Compensation",
    desc: "Every listing discloses salary or stipend ranges upfront. No guessing games.",
    icon: (
      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Zero Ghosting Policy",
    desc: "Recruiters are held to status update windows. You always know where your application stands.",
    icon: (
      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Direct Team Communication",
    desc: "Connect directly with engineering managers and startup founders without agency middlemen.",
    icon: (
      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className="font-display text-2xl sm:text-3xl font-black text-zinc-900">
      {display}{suffix}
    </span>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-28 bg-white border-b border-zinc-200/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Mission & Core Value Pillars */}
          <motion.div
            className="lg:col-span-6"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Our Mission &amp; Standards
              </span>
            </div>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight text-zinc-900 leading-tight">
              A modern standard for tech hiring and internships
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-600 font-normal">
              Traditional job portals are cluttered with outdated listings, predatory staffing agencies, and resume black holes. We built Triad Portal to provide clarity, verified company profiles, and direct connections between candidates and technical leads.
            </p>

            {/* Core Pillars */}
            <div className="mt-8 space-y-4">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex items-start gap-4 rounded-2xl border border-zinc-200/70 bg-stone-50/60 p-4 transition-all hover:bg-orange-50/20 hover:border-orange-200"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100/70 border border-orange-200/50">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-zinc-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-600 leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Visual Collage with High-Res Image & Floating Glass Cards */}
          <motion.div
            className="relative lg:col-span-6"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {/* Main Visual Workspace Image Card */}
            <div className="relative overflow-hidden rounded-[32px] border border-zinc-200/90 bg-zinc-950 shadow-2xl">
              <div
                className="h-[420px] sm:h-[480px] w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85")`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Bottom Image Caption */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white/90">
                    Trusted by 120+ verified teams
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-white">
                  Collaborative hiring for engineers, designers, and innovators.
                </p>
              </div>
            </div>

            {/* Floating Glassmorphism Metric Card 1: Top Right */}
            <div className="absolute -top-4 -right-2 sm:-right-4 z-20 rounded-2xl border border-white/80 bg-white/95 p-4 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.12)] backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-sm shadow-md shadow-orange-500/30">
                  ★
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <Counter value={98} suffix="%" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-500">Placement satisfaction</p>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphism Metric Card 2: Bottom Left Overlap */}
            <div className="absolute -bottom-6 -left-2 sm:-left-6 z-20 rounded-2xl border border-white/80 bg-white/95 p-4 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.12)] backdrop-blur-md max-w-xs">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-600 text-[10px] font-black text-white">
                    JD
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-black text-white">
                    AK
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-[10px] font-black text-white">
                    SL
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-0.5">
                    <Counter value={10} suffix="k+" />
                  </div>
                  <p className="text-[11px] font-semibold text-zinc-500">Engineers &amp; designers hired</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
