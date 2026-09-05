"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: number | string;
  index?: number;
}

export function StatCard({ label, value, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      </Card>
    </motion.div>
  );
}
