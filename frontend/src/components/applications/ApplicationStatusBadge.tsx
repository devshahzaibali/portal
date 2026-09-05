"use client";

import { Badge } from "@/components/ui/Badge";
import type { ApplicationStatus } from "@/types/application";

const statusVariant: Record<ApplicationStatus, "default" | "accent" | "success" | "warning" | "danger" | "muted"> = {
  applied: "muted",
  shortlisted: "accent",
  interview: "warning",
  offered: "success",
  hired: "success",
  rejected: "danger",
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]} className="capitalize">
      {status}
    </Badge>
  );
}
