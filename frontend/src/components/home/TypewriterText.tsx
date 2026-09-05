"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypewriterText({
  words = ["Engineering Roles", "Product Designers", "AI Specialists", "Full-Stack Builders", "Marketing Leads"],
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 2000,
  className = "",
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fullText = words[wordIndex % words.length];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        const nextCharTimer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, typingSpeed + (Math.random() * 30 - 15));
        return () => clearTimeout(nextCharTimer);
      } else {
        setIsPaused(true);
      }
    } else {
      if (currentText.length > 0) {
        const deleteCharTimer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, deletingSpeed);
        return () => clearTimeout(deleteCharTimer);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [currentText, isDeleting, isPaused, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center tracking-tight ${className}`}>
      <span className="text-gradient-orange font-extrabold">{currentText || "\u00A0"}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
        className="ml-1 inline-block h-[0.9em] w-[3px] rounded-full bg-orange-500 align-middle"
        aria-hidden="true"
      />
    </span>
  );
}
