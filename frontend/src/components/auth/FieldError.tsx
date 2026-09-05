"use client";

import { AnimatePresence, motion } from "framer-motion";

interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-1.5 text-xs text-danger-text"
          role="alert"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
