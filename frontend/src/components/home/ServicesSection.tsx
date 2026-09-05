"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { blurIn, staggerContainer, viewportOnce } from "@/lib/motion";

const SERVICES = [
  {
    title: "Curated Role Discovery",
    desc: "Filter by exact tech stacks, work modes, and transparent compensation bounds.",
    badge: "Smart Filters",
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    preview: (
      <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-semibold">
        <span className="rounded-md bg-orange-100/70 text-orange-700 px-2 py-0.5 border border-orange-200/60">React &bull; Next.js</span>
        <span className="rounded-md bg-zinc-100 text-zinc-700 px-2 py-0.5">Remote</span>
        <span className="rounded-md bg-emerald-100/70 text-emerald-800 px-2 py-0.5">$45 / hr</span>
      </div>
    ),
  },
  {
    title: "Transparent Pipeline Tracking",
    desc: "Know exactly when your resume is viewed, shortlisted, and scheduled for interviews.",
    badge: "Real-time Status",
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    preview: (
      <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-100/80 p-2.5 text-[11px] font-bold">
        <span className="text-zinc-600">Review</span>
        <span className="text-zinc-400">&rarr;</span>
        <span className="text-orange-600 font-extrabold bg-white px-2 py-0.5 rounded-md shadow-xs">Interview</span>
        <span className="text-zinc-400">&rarr;</span>
        <span className="text-zinc-600">Offer</span>
      </div>
    ),
  },
  {
    title: "One-Click Candidate Profile",
    desc: "Store your portfolio, GitHub, and resume once. Apply to any verified role in seconds.",
    badge: "1-Click Apply",
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    preview: (
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-zinc-50 border border-zinc-200/80 p-2 text-xs">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 font-bold text-white text-[10px]">✓</span>
        <span className="font-semibold text-zinc-700">Resume &amp; GitHub Synced</span>
      </div>
    ),
  },
  {
    title: "Recruiter Dashboard",
    desc: "Post openings, filter incoming candidates by skill tags, and collaborate with your team.",
    badge: "For Employers",
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 011.875 1.875v1.875H3.75V6.375A1.875 1.875 0 015.625 4.5z" />
      </svg>
    ),
    preview: (
      <div className="mt-4 flex items-center justify-between rounded-xl bg-white border border-zinc-200 p-2.5 text-xs font-semibold text-zinc-800 shadow-xs">
        <span>Active Applicants</span>
        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-600 font-extrabold text-[11px]">24 New</span>
      </div>
    ),
  },
  {
    title: "Verified Companies Only",
    desc: "Every company profile and posting is admin-verified to eliminate ghost jobs and spam.",
    badge: "100% Quality",
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    preview: (
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-xl p-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">🛡</span>
        <span>Identity &amp; Domain Verified</span>
      </div>
    ),
  },
  {
    title: "Instant Decision Alerts",
    desc: "Receive email and portal notifications the instant an interview invitation or offer is sent.",
    badge: "Instant Alerts",
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    preview: (
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-zinc-700 bg-zinc-50 border border-zinc-200/80 rounded-xl p-2">
        <span className="text-orange-500 font-bold">⚡</span>
        <span>Offer letter ready for review</span>
      </div>
    ),
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 border-b border-zinc-200/80 bg-stone-50/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={blurIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
              Core Capabilities
            </span>
          </div>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
            Engineered for speed, transparency, and high signal
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 font-normal">
            Everything both candidates and hiring managers need to connect without noise.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.title}
              variants={blurIn}
              whileHover={{ y: -4 }}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:border-orange-500/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 border border-orange-200/60 shadow-xs">
                    {service.icon}
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-bold text-zinc-600">
                    {service.badge}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-base font-bold text-zinc-900">
                  {service.title}
                </h3>
                <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed font-medium">
                  {service.desc}
                </p>
              </div>

              <div className="pt-2">{service.preview}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          variants={blurIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Link href="/jobs">
            <Button size="md" className="font-bold shadow-md shadow-orange-600/15">
              Explore Active Positions &rarr;
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
