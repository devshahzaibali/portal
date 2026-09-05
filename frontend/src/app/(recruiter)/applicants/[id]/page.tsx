"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApplicationProfileCard } from "@/components/applications/ApplicationProfileCard";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { ApplicationTimeline } from "@/components/applications/ApplicationTimeline";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { FormSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getApplicationById, updateApplicationStatus } from "@/lib/api/applications";
import { getInterview, scheduleInterview, updateInterview } from "@/lib/api/interviews";
import type { Application, ApplicationStatus } from "@/types/application";
import type { Interview } from "@/types/interview";
import { formatDateTime, getErrorMessage } from "@/lib/utils";

const interviewSchema = z.object({
  scheduledAt: z.string().min(1, "Date/time is required"),
  mode: z.enum(["online", "onsite"]),
  meetingDetails: z.string().optional(),
  notes: z.string().optional(),
});

type InterviewForm = z.infer<typeof interviewSchema>;

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "offered", label: "Offered" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

export default function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showInterview, setShowInterview] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("applied");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InterviewForm>({
    resolver: zodResolver(interviewSchema),
    defaultValues: { mode: "online" },
  });

  useEffect(() => {
    Promise.all([getApplicationById(id), getInterview(id).catch(() => null)])
      .then(([app, int]) => {
        setApplication(app);
        setInterview(int);
        setNewStatus(app.status);
        if (int) {
          reset({
            scheduledAt: int.scheduledAt.slice(0, 16),
            mode: int.mode,
            meetingDetails: int.meetingDetails || "",
            notes: int.notes || "",
          });
        }
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [id, reset]);

  const handleStatusUpdate = async () => {
    setError("");
    setSuccess("");
    setStatusUpdating(true);
    try {
      const updated = await updateApplicationStatus(id, { status: newStatus });
      setApplication(updated);
      setSuccess("Status updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStatusUpdating(false);
    }
  };

  const onInterviewSubmit = async (data: InterviewForm) => {
    setError("");
    try {
      if (interview) {
        const updated = await updateInterview(interview._id, {
          ...data,
          scheduledAt: new Date(data.scheduledAt).toISOString(),
        });
        setInterview(updated);
      } else {
        const created = await scheduleInterview(id, {
          ...data,
          scheduledAt: new Date(data.scheduledAt).toISOString(),
        });
        setInterview(created);
      }
      setShowInterview(false);
      setSuccess("Interview saved.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <FormSkeleton />
        <PageLoader message="Loading applicant..." />
      </div>
    );
  }
  if (!application) return <p className="text-danger-text">{error || "Not found"}</p>;

  const candidate = typeof application.candidate === "object" ? application.candidate : null;
  const displayName = application.fullName || candidate?.name || "Applicant";
  const displayEmail = application.email || candidate?.email;
  const isTerminal = application.status === "hired" || application.status === "rejected";

  return (
    <div>
      <Link href="/recruiter/dashboard" className="text-sm text-muted hover:text-accent">
        ← Back to dashboard
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">{displayName}</h1>
          <p className="mt-1 text-muted">{displayEmail}</p>
          <p className="mt-1 text-sm text-muted">
            Applied {formatDateTime(application.appliedAt)}
          </p>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      <Card className="mt-6 p-6">
        <ApplicationTimeline status={application.status} appliedAt={application.appliedAt} />
      </Card>

      <div className="mt-6">
        <ApplicationProfileCard application={application} />
      </div>

      {application.coverNote && (
        <Card className="mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">Cover letter</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {application.coverNote}
          </p>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Update status</h2>
          {isTerminal && (
            <p className="text-xs text-muted">Terminal status — only an admin can change this further.</p>
          )}
          <Select
            label="Status"
            options={statusOptions}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
            disabled={isTerminal}
          />
          <Button
            onClick={handleStatusUpdate}
            disabled={isTerminal || newStatus === application.status}
            isLoading={statusUpdating}
            loadingText="Updating..."
          >
            Update status
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Interview</h2>
            <Button variant="outline" size="sm" onClick={() => setShowInterview(true)}>
              {interview ? "Edit interview" : "Schedule interview"}
            </Button>
          </div>
          {interview ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-muted">Scheduled</dt>
                <dd className="font-medium">{formatDateTime(interview.scheduledAt)}</dd>
              </div>
              <div>
                <dt className="text-muted">Mode</dt>
                <dd className="font-medium capitalize">{interview.mode}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted">No interview scheduled yet.</p>
          )}
        </Card>
      </div>

      {error && <p className="mt-4 text-sm text-danger-text">{error}</p>}
      {success && <p className="mt-4 text-sm text-accent">{success}</p>}

      <Modal isOpen={showInterview} onClose={() => setShowInterview(false)} title={interview ? "Edit interview" : "Schedule interview"}>
        <form onSubmit={handleSubmit(onInterviewSubmit)} className="space-y-4">
          <Input label="Date & time" type="datetime-local" error={errors.scheduledAt?.message} {...register("scheduledAt")} />
          <Select label="Mode" options={[{ value: "online", label: "Online" }, { value: "onsite", label: "Onsite" }]} {...register("mode")} />
          <Input label="Meeting details" placeholder="Link or address" {...register("meetingDetails")} />
          <Input label="Notes" {...register("notes")} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowInterview(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} loadingText="Saving...">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
