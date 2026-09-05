"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TypewriterText } from "@/components/home/TypewriterText";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { blurIn, heroLine } from "@/lib/motion";
import { cn } from "@/lib/utils";

const POPULAR_TAGS = ["Remote", "Internship", "Engineering", "Design", "AI / ML", "Full-Stack"];

const FEATURED_JOBS = [
  {
    id: "6a9b1d8015b2c713ebb91498",
    title: "React Frontend Intern",
    company: "Triad Labz",
    companyColor: "from-orange-500 to-amber-600",
    companyInitial: "TL",
    location: "Remote · Global",
    workMode: "Remote",
    type: "Internship",
    salary: "$40 – $55 / hr",
    categories: ["all", "internship", "engineering", "remote"],
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    posted: "2d ago",
    applicantsCount: "12 applied",
    description: "Build accessible web interfaces, implement micro-interactions, and optimize real-time candidate experiences.",
  },
  {
    id: "6a9b1d8015b2c713ebb9149a",
    title: "AI Systems Engineering Intern",
    company: "Apex Dynamics",
    companyColor: "from-purple-600 to-indigo-600",
    companyInitial: "AD",
    location: "San Francisco · Hybrid",
    workMode: "Hybrid",
    type: "Internship",
    salary: "$45 – $60 / hr",
    categories: ["all", "internship", "engineering"],
    skills: ["Python", "PyTorch", "FastAPI", "Vector DBs"],
    posted: "1d ago",
    applicantsCount: "18 applied",
    description: "Develop evaluation benchmarks and model inference pipelines for production machine learning workflows.",
  },
  {
    id: "6a9b1d8015b2c713ebb9149a",
    title: "Full-Stack MERN Developer",
    company: "Triad Labz",
    companyColor: "from-orange-500 to-amber-600",
    companyInitial: "TL",
    location: "Lahore · Onsite",
    workMode: "Onsite",
    type: "Full-Time",
    salary: "$75k – $95k / yr",
    categories: ["all", "engineering"],
    skills: ["Node.js", "React", "MongoDB", "Express"],
    posted: "3d ago",
    applicantsCount: "9 applied",
    description: "Architect high-throughput backend services and secure authentication workflows for enterprise teams.",
  },
  {
    id: "6a9b1d8015b2c713ebb91498",
    title: "Product Design Fellow",
    company: "Forma Studio",
    companyColor: "from-pink-500 to-rose-600",
    companyInitial: "FS",
    location: "Remote · US / EU",
    workMode: "Remote",
    type: "Fellowship",
    salary: "$35 – $48 / hr",
    categories: ["all", "internship", "design", "remote"],
    skills: ["Figma", "Design Systems", "Prototyping", "UX"],
    posted: "Just now",
    applicantsCount: "6 applied",
    description: "Create design system components, conduct usability interviews, and shape our core product UX.",
  },
  {
    id: "6a9b1d8015b2c713ebb9149c",
    title: "DevOps & Cloud Administrator",
    company: "Horizon Cloud",
    companyColor: "from-blue-600 to-cyan-600",
    companyInitial: "HC",
    location: "Remote · Global",
    workMode: "Remote",
    type: "Contract",
    salary: "$80k – $110k / yr",
    categories: ["all", "engineering", "remote"],
    skills: ["Docker", "Kubernetes", "AWS", "Linux"],
    posted: "4d ago",
    applicantsCount: "14 applied",
    description: "Maintain zero-downtime CI/CD deployment pipelines and manage scalable distributed cloud clusters.",
  },
  {
    id: "6a9b1d8015b2c713ebb91496",
    title: "Junior Backend Developer",
    company: "Triad Labz",
    companyColor: "from-orange-500 to-amber-600",
    companyInitial: "TL",
    location: "Lahore · Hybrid",
    workMode: "Hybrid",
    type: "Internship",
    salary: "$30 – $45 / hr",
    categories: ["all", "internship", "engineering"],
    skills: ["Node.js", "PostgreSQL", "REST APIs", "Redis"],
    posted: "1d ago",
    applicantsCount: "11 applied",
    description: "Build robust database schemas, query optimizations, and secure REST endpoints for high-traffic services.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Search and filter",
    desc: "Browse verified internships and full-time roles with clear salary ranges, tech stacks, and remote options.",
    badge: "Step 1 · Discovery",
    cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    chips: ["Remote", "$45/hr+", "React"],
    metric: "140+ verified openings",
  },
  {
    step: "02",
    title: "Apply in minutes",
    desc: "Use your saved profile to apply with one click. No repetitive questionnaires or external resume uploads.",
    badge: "Step 2 · 1-Click Apply",
    cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    chips: ["Verified Profile", "Portfolio Linked"],
    metric: "Direct delivery to hiring lead",
  },
  {
    step: "03",
    title: "Track your status",
    desc: "Get real updates as recruiters review your application, schedule interviews, and extend formal offers.",
    badge: "Step 3 · Offer & Growth",
    cover: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    chips: ["Technical Round", "Offer Received"],
    metric: "Real-time milestone notifications",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/jobs?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <>
      {/* Hero Section: Covers 100vh together with Navbar */}
      <section className="relative h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=90")`,
            }}
          />
          {/* High-Contrast Gradient Dark Overlay for natural text sharpness without glowing */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/80 pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-20 sm:pt-24 pb-8 text-center w-full flex flex-col items-center justify-center">
          {/* Status Pill Badge - Natural, Human Copy */}
          <motion.div custom={0} variants={heroLine} initial="hidden" animate="visible">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-white/90">
                Now hiring for Summer &amp; Fall 2026 roles
              </span>
            </div>
          </motion.div>

          {/* Heading: Pure White, Razor-Sharp, Zero Artificial Glow */}
          <motion.h1
            custom={1}
            variants={heroLine}
            initial="hidden"
            animate="visible"
            className="mt-6 font-display text-4xl sm:text-6xl lg:text-[4.35rem] font-black tracking-[-0.035em] text-white leading-[1.1]"
          >
            Find your next <br />
            <TypewriterText
              words={[
                "Software Internship",
                "Product Design Role",
                "AI Engineering Seat",
                "Full-Stack Position",
              ]}
              className="mt-1"
            />
          </motion.h1>

          {/* Subtitle: High-Contrast Crisp Off-White */}
          <motion.p
            custom={2}
            variants={heroLine}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-4 max-w-lg text-base sm:text-lg font-medium text-zinc-200"
          >
            Connect directly with engineering leads and hiring teams. Transparent compensation, no ghosting.
          </motion.p>

          {/* Floating Search Pill */}
          <motion.div
            custom={3}
            variants={heroLine}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-8 max-w-xl w-full"
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center rounded-full border border-white/20 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/30"
            >
              <div className="flex flex-1 items-center gap-2.5 pl-4 pr-2">
                <svg className="h-5 w-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Role, skill, or company (e.g. React, Python)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
                />
              </div>
              <Button type="submit" size="md" className="rounded-full px-6 font-bold shadow-md">
                Search
              </Button>
            </form>

            {/* Trending Minimalist Chips: Clean Contrast */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-zinc-300 font-semibold">Trending:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                  className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-zinc-200 font-medium backdrop-blur-md transition-all hover:border-orange-400 hover:text-white hover:bg-black/60 shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip: Social Proof with Clean SVG Emblems */}
      <section className="border-b border-zinc-200/80 bg-stone-50/70 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-zinc-400">
            Trusted by candidates &amp; hiring teams from leading technology companies
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-zinc-600 font-display font-bold text-sm tracking-wide">
            <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-zinc-200/70 px-3.5 py-1.5 shadow-xs hover:border-orange-500/40 hover:text-zinc-950 transition-all">
              <span className="text-zinc-900 font-black">▲</span>
              <span>Vercel</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-zinc-200/70 px-3.5 py-1.5 shadow-xs hover:border-orange-500/40 hover:text-zinc-950 transition-all">
              <span className="text-indigo-600 font-black">///</span>
              <span>Stripe</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-zinc-200/70 px-3.5 py-1.5 shadow-xs hover:border-orange-500/40 hover:text-zinc-950 transition-all">
              <span className="text-purple-600 font-bold">◈</span>
              <span>Linear</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-zinc-200/70 px-3.5 py-1.5 shadow-xs hover:border-orange-500/40 hover:text-zinc-950 transition-all">
              <span className="text-emerald-500 font-bold">⚡</span>
              <span>Supabase</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-zinc-200/70 px-3.5 py-1.5 shadow-xs hover:border-orange-500/40 hover:text-zinc-950 transition-all">
              <span className="text-blue-500 font-bold">❖</span>
              <span>Retool</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-zinc-200/70 px-3.5 py-1.5 shadow-xs hover:border-orange-500/40 hover:text-zinc-950 transition-all">
              <span className="text-amber-500 font-bold">●</span>
              <span>Datadog</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Openings */}
      <section id="openings" className="scroll-mt-20 py-20 sm:py-28 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header Row with Filter Pills */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                  Verified Hiring Board
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
                Featured opportunities &amp; internships
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-zinc-600 max-w-xl">
                Direct applications to engineering and design leads. Upfront salary, verified companies, zero ghosting.
              </p>
            </div>

            {/* Interactive Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Openings" },
                { id: "internship", label: "Internships" },
                { id: "engineering", label: "Engineering" },
                { id: "remote", label: "Remote Only" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer",
                    selectedCategory === tab.id
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {FEATURED_JOBS.filter((job) =>
                selectedCategory === "all" ? true : job.categories.includes(selectedCategory)
              ).map((job) => (
                <motion.div
                  layout
                  key={job.id + job.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-orange-500/60 hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    {/* Top Row: Company Logo & Info + Type Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${job.companyColor} font-display font-black text-white text-xs shadow-xs`}
                        >
                          {job.companyInitial}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display text-sm font-bold text-zinc-900">
                              {job.company}
                            </span>
                            <span
                              className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/70"
                              title="Verified employer"
                            >
                              ✓
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500 font-medium">
                            <span className="flex items-center gap-1">
                              <svg className="h-3.5 w-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              {job.location}
                            </span>
                            <span>&bull;</span>
                            <span className="text-zinc-400">{job.posted}</span>
                          </div>
                        </div>
                      </div>

                      <span className="rounded-full bg-orange-50 border border-orange-200/70 px-2.5 py-1 text-[11px] font-bold text-orange-700 shrink-0">
                        {job.type}
                      </span>
                    </div>

                    {/* Job Title */}
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="mt-4 font-display text-base font-bold text-zinc-900 group-hover:text-orange-600 transition-colors leading-snug">
                        {job.title}
                      </h3>
                    </Link>

                    {/* 1-Line Description */}
                    <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed font-normal line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skill Tags with Clean Spacing and Styling */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-zinc-50 border border-zinc-200/80 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 transition-colors group-hover:border-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Compensation & View Role Button */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                        Compensation
                      </span>
                      <span className="font-display text-base font-extrabold text-orange-600">
                        {job.salary}
                      </span>
                    </div>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white shadow-xs group-hover:bg-orange-600 transition-all active:scale-95"
                    >
                      <span>View Role</span>
                      <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Bottom Explore Banner */}
          <div className="mt-12 rounded-2xl border border-zinc-200/90 bg-stone-50/80 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-display text-base font-bold text-zinc-900">
                Looking for more engineering, product, or design roles?
              </h4>
              <p className="mt-1 text-xs text-zinc-600 font-medium">
                Explore all verified openings with custom salary, skill, and location filters.
              </p>
            </div>
            <Link href="/jobs" className="shrink-0">
              <Button size="md" className="font-bold shadow-md shadow-orange-600/15">
                Browse All Openings &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Photographic Banners: Candidates vs Employers */}
      <section className="py-20 bg-stone-50 border-b border-zinc-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-orange-600">For Candidates &amp; Employers</p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Whether you&apos;re looking for a role or looking to hire
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Candidate Card Banner */}
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-950 p-8 sm:p-10 shadow-lg flex flex-col justify-between min-h-[380px]">
              {/* Photo Background */}
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85")`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/60" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1 backdrop-blur-md">
                  <span className="text-xs font-semibold text-white/90">
                    For Candidates
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                  Apply once. Skip the applicant tracking black hole.
                </h3>
                <p className="mt-3 text-sm text-zinc-300 font-normal leading-relaxed max-w-md">
                  Your profile goes straight to hiring managers. Track every application status, interview date, and feedback in one place.
                </p>

                <ul className="mt-5 space-y-2 text-xs font-medium text-zinc-200">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> Direct communication with hiring teams
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> Salary and stipend disclosed upfront
                  </li>
                </ul>
              </div>

              <div className="relative z-10 mt-8">
                <Link href="/jobs">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95">
                    Browse Student Roles &rarr;
                  </button>
                </Link>
              </div>
            </div>

            {/* Employer Card Banner */}
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-950 p-8 sm:p-10 shadow-lg flex flex-col justify-between min-h-[380px]">
              {/* Photo Background */}
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85")`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/60" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1 backdrop-blur-md">
                  <span className="text-xs font-semibold text-white/90">
                    For Employers
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                  Post a role and meet qualified candidates fast
                </h3>
                <p className="mt-3 text-sm text-zinc-300 font-normal leading-relaxed max-w-md">
                  Review pre-screened student profiles, GitHub projects, and resumes without wading through thousands of unqualified applications.
                </p>

                <ul className="mt-5 space-y-2 text-xs font-medium text-zinc-200">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> No agency fees or middlemen
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> Manage your entire hiring pipeline in one dashboard
                  </li>
                </ul>
              </div>

              <div className="relative z-10 mt-8">
                <Link href="/register">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-zinc-900 shadow-md transition-all hover:bg-zinc-100 active:scale-95">
                    Post an Opening &rarr;
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Clean 3-Step Process */}
      <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28 bg-white border-b border-zinc-200/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Our 3-Step Flow
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
              Three transparent steps from search to offer
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 max-w-xl mx-auto">
              Skip the applicant black holes and repetitive forms. Here is how our streamlined hiring path works.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((item, idx) => (
              <motion.div
                key={item.step}
                whileHover={{ y: -5 }}
                className="group flex flex-col justify-between rounded-3xl border border-zinc-200/90 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-xl"
              >
                <div>
                  {/* Photo Header with Step Pill */}
                  <div className="relative h-40 w-full overflow-hidden bg-zinc-950">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url("${item.cover}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

                    {/* Glowing Step Badge */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 font-display font-black text-white text-xs shadow-md shadow-orange-600/30">
                        {item.step}
                      </span>
                      <span className="rounded-full bg-black/50 border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-600 font-normal">
                      {item.desc}
                    </p>

                    {/* Feature Chips */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-md bg-stone-100 border border-zinc-200/60 px-2 py-0.5 text-[11px] font-medium text-zinc-700"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Metric Strip */}
                <div className="px-6 py-3.5 bg-stone-50/60 border-t border-zinc-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                    ✓
                  </span>
                  <span>{item.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <AboutSection />

      {/* Photographic Call-To-Action Banner */}
      <section className="relative overflow-hidden py-20 sm:py-24 bg-zinc-950 text-white">
        {/* Photo Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2400&q=85")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/90">
              Get Started Today
            </span>
          </div>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Ready to find your next role?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base font-normal leading-relaxed text-zinc-300">
            Create your candidate profile or post your company role in under two minutes and skip the agency markups.
          </p>

          {/* Value Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-zinc-300">
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>48-Hour response window</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="text-orange-400 font-bold">✓</span>
              <span>100% Verified employers</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="text-amber-400 font-bold">✓</span>
              <span>Transparent salary bounds</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <button className="rounded-xl bg-orange-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-transform hover:bg-orange-500 hover:scale-105 active:scale-95">
                Create Free Account
              </button>
            </Link>
            <Link href="/jobs">
              <button className="rounded-xl border border-white/25 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20">
                Explore Openings &rarr;
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
