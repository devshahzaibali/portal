"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { deleteJob, getJobById, updateJob } from "@/lib/api/jobs";
import { getErrorMessage } from "@/lib/utils";

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  skills: z.string().optional(),
  type: z.enum(["full-time", "part-time", "internship", "contract"]),
  workMode: z.enum(["remote", "onsite", "hybrid"]),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  deadline: z.string().min(1),
});

type JobForm = z.infer<typeof jobSchema>;

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    getJobById(id)
      .then((job) => {
        setStatus(job.status);
        reset({
          title: job.title,
          description: job.description,
          skills: job.skills?.join(", ") || "",
          type: job.type,
          workMode: job.workMode,
          location: job.location || "",
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          deadline: job.deadline.slice(0, 10),
        });
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, [id, reset]);

  const onSubmit = async (data: JobForm) => {
    setError("");
    setSuccess("");
    try {
      const updated = await updateJob(id, {
        ...data,
        skills: data.skills ? data.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      });
      setStatus(updated.status);
      setSuccess("Job updated. It will need re-approval if previously approved.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteJob(id);
      router.push("/recruiter/jobs");
    } catch (err) {
      setError(getErrorMessage(err));
      setIsDeleting(false);
    }
  };

  if (!status && !error) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-semibold">Edit job</h1>
        {status && <Badge variant={status === "approved" ? "success" : "warning"}>{status}</Badge>}
      </div>
      {status === "approved" && (
        <p className="mt-2 text-xs text-muted">Editing resets status to pending for admin review.</p>
      )}
      <Card className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none" rows={6} {...register("description")} />
          </div>
          <Input label="Skills" {...register("skills")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Type" options={[
              { value: "full-time", label: "Full-time" },
              { value: "part-time", label: "Part-time" },
              { value: "internship", label: "Internship" },
              { value: "contract", label: "Contract" },
            ]} {...register("type")} />
            <Select label="Work mode" options={[
              { value: "remote", label: "Remote" },
              { value: "onsite", label: "Onsite" },
              { value: "hybrid", label: "Hybrid" },
            ]} {...register("workMode")} />
          </div>
          <Input label="Location" {...register("location")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Salary min"
              type="number"
              {...register("salaryMin", {
                setValueAs: (v) => (v === "" || v === null || isNaN(Number(v)) ? undefined : Number(v)),
              })}
            />
            <Input
              label="Salary max"
              type="number"
              {...register("salaryMax", {
                setValueAs: (v) => (v === "" || v === null || isNaN(Number(v)) ? undefined : Number(v)),
              })}
            />
          </div>
          <Input label="Deadline" type="date" {...register("deadline")} />
          {error && <p className="text-sm text-danger-text">{error}</p>}
          {success && <p className="text-sm text-accent">{success}</p>}
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSubmitting} loadingText="Saving...">Save changes</Button>
            <Button type="button" variant="danger" onClick={handleDelete} isLoading={isDeleting} loadingText="Deleting...">Delete</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
