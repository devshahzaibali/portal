import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import type { ApplicationStatus } from "@/types/application";
import { formatDate } from "@/lib/utils";

const stages: ApplicationStatus[] = [
  "applied",
  "shortlisted",
  "interview",
  "offered",
  "hired",
];

interface ApplicationTimelineProps {
  status: ApplicationStatus;
  appliedAt: string;
}

export function ApplicationTimeline({ status, appliedAt }: ApplicationTimelineProps) {
  const currentIndex = stages.indexOf(status);
  const isRejected = status === "rejected";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ApplicationStatusBadge status={status} />
        <span className="text-sm text-muted">Applied {formatDate(appliedAt)}</span>
      </div>
      {!isRejected && (
        <div className="flex items-center gap-2">
          {stages.map((stage, i) => (
            <div key={stage} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  i <= currentIndex ? "bg-accent" : "bg-border"
                }`}
              />
              {i < stages.length - 1 && (
                <div className={`h-px w-8 ${i < currentIndex ? "bg-accent" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
