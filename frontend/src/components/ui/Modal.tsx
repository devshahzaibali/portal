"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl";
}

const sizeClasses = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

export function Modal({ isOpen, onClose, title, children, className, size = "md" }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-overlay"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-10 w-full rounded-2xl border border-border bg-surface shadow-premium sm:p-8",
              sizeClasses[size],
              className
            )}
          >
            <div className={cn("mb-4 flex items-center justify-between", !title && "mb-0 justify-end absolute right-6 top-6 z-10 sm:right-8 sm:top-8")}>
              {title && (
                <h2 id="modal-title" className="font-display text-xl font-semibold">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            {title ? children : <div className="relative">{children}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
