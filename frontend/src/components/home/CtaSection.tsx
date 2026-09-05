"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { blurIn, viewportOnce } from "@/lib/motion";

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-navy px-6 py-16 text-center sm:px-12 sm:py-20"
          variants={blurIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />

          <h2 className="relative font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Ready to accelerate your career?
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-base text-white/65 sm:text-lg">
            Join thousands of candidates and recruiters already using the platform to find talent
            and land great roles.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">Get started free</Button>
            </Link>
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 sm:w-auto"
              >
                Browse jobs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
