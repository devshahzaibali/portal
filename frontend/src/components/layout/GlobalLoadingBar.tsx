"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { subscribeLoading } from "@/lib/api/loadingManager";

export function GlobalLoadingBar() {
  const [activeCount, setActiveCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeLoading(setActiveCount);
    return () => {
      unsubscribe();
    };
  }, []);

  const isLoading = activeCount > 0;

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(timer);
    }

    setProgress(12);
    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 12));
    }, 350);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {(isLoading || progress > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-accent/10"
        >
          <motion.div
            className="h-full bg-gradient-blue shadow-glow"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
