"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { createJob } from "@/lib/api/jobs";
import { addStoredJobId } from "@/lib/recruiterJobs";
import { getErrorMessage } from "@/lib/utils";

const jobSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  skills: z.string().optional(),
  type: z.enum(["full-time", "part-time", "internship", "contract"]),
  workMode: z.enum(["remote", "onsite", "hybrid"]),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  deadline: z.string().min(1, "Deadline is required"),
});

type JobForm = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: { type: "internship", workMode: "hybrid" },
  });

  const onSubmit = async (data: JobForm) => {
    setError("");
    try {
      const job = await createJob({
        ...data,
        skills: data.skills ? data.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      });
      addStoredJobId(job._id);
      router.push(`/recruiter/jobs/${job._id}/edit`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Post a new job</h1>
      <p className="mt-2 text-muted">Jobs require admin approval before going live</p>
      <Card className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-accent focus:outline-none" rows={6} {...register("description")} />
            {errors.description && <p className="mt-1 text-xs text-danger-text">{errors.description.message}</p>}
          </div>
          <Input label="Skills (comma-separated)" {...register("skills")} />
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
          <Input label="Deadline" type="date" error={errors.deadline?.message} {...register("deadline")} />
          {error && <p className="text-sm text-danger-text">{error}</p>}
          <Button type="submit" isLoading={isSubmitting} loadingText="Creating...">Create job</Button>
        </form>
      </Card>
    </div>
  );
}
