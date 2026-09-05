"use client";

import { motion } from "framer-motion";
import { blurIn, staggerContainer, viewportOnce } from "@/lib/motion";

const STEPS = [
  { step: "01", title: "Create your account", desc: "Sign up as a candidate or recruiter in under a minute." },
  { step: "02", title: "Browse or post jobs", desc: "Candidates explore listings; recruiters publish approved openings." },
  { step: "03", title: "Apply or review", desc: "Submit applications with one profile or review incoming candidates." },
  { step: "04", title: "Track progress", desc: "Follow every stage from applied to hired in your dashboard." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={blurIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">How it works</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Four steps to your next opportunity
          </h2>
        </motion.div>

        <motion.div
          className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div aria-hidden className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent lg:block" />

          {STEPS.map((item, index) => (
            <motion.div key={item.step} variants={blurIn} className="relative text-center lg:text-left">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-orange font-display text-sm font-bold text-white shadow-[0_0_24px_rgba(249,115,22,0.35)] lg:mx-0"
              >
                {item.step}
              </motion.div>
              <h3 className="mt-5 font-display text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
              {index < STEPS.length - 1 && (
                <div aria-hidden className="mx-auto mt-8 h-8 w-px bg-border sm:hidden" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
