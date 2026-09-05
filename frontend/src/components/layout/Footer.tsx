"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const FOOTER_LINKS = {
  Platform: [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/register", label: "Create Account" },
    { href: "/login", label: "Sign In" },
    { href: "/applications", label: "Applications" },
  ],
  Company: [
    { href: "/#openings", label: "Openings" },
    { href: "/#services", label: "Services" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#about", label: "About us" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <motion.div
        className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6"
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-2">
            <BrandLogo size="md" className="[&_span]:text-white" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Connecting talented candidates with verified companies. Find roles, track applications,
              and manage hiring — all in one trusted platform.
            </p>
          </motion.div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <motion.div key={title} variants={fadeUp}>
              <p className="text-xs font-bold uppercase tracking-widest text-white/90">{title}</p>
              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors duration-200 hover:text-accent-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row"
        >
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Internship & Job Portal. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Built for candidates, recruiters, and admins.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
