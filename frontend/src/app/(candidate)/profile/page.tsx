"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { FormSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { getProfile, updateProfile } from "@/lib/api/profile";
import { getErrorMessage } from "@/lib/utils";

const profileSchema = z.object({
  headline: z.string().optional(),
  skills: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  education: z.array(z.object({
    degree: z.string().optional(),
    institution: z.string().optional(),
    year: z.number().optional(),
  })).optional(),
  experience: z.array(z.object({
    company: z.string().optional(),
    role: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });

  useEffect(() => {
    getProfile()
      .then((profile) => {
        reset({
          headline: profile.headline || "",
          skills: profile.skills?.join(", ") || "",
          resumeUrl: profile.resumeUrl || "",
          portfolioUrl: profile.portfolioUrl || "",
          education: profile.education?.length ? profile.education : [{ degree: "", institution: "", year: undefined }],
          experience: profile.experience?.length ? profile.experience.map((e) => ({
            ...e,
            startDate: e.startDate ? String(e.startDate).slice(0, 10) : "",
            endDate: e.endDate ? String(e.endDate).slice(0, 10) : "",
          })) : [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
        });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: ProfileForm) => {
    setError("");
    setSuccess("");
    try {
      const cleanEducation = (data.education || [])
        .filter((e) => e.degree?.trim() || e.institution?.trim())
        .map((e) => ({
          degree: e.degree?.trim(),
          institution: e.institution?.trim(),
          year: e.year,
        }));

      const cleanExperience = (data.experience || [])
        .filter((e) => e.company?.trim() || e.role?.trim())
        .map((e) => ({
          company: e.company?.trim(),
          role: e.role?.trim(),
          startDate: e.startDate?.trim() || undefined,
          endDate: e.endDate?.trim() || undefined,
          description: e.description?.trim(),
        }));

      await updateProfile({
        headline: data.headline?.trim(),
        skills: data.skills ? data.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        resumeUrl: data.resumeUrl?.trim() || undefined,
        portfolioUrl: data.portfolioUrl?.trim() || undefined,
        education: cleanEducation,
        experience: cleanExperience,
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <FormSkeleton />
        <PageLoader message="Loading profile..." />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Profile</h1>
      <p className="mt-2 text-muted">Manage your candidate profile</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Card className="space-y-4">
          <Input label="Headline" placeholder="e.g. Junior Full-Stack Developer" error={errors.headline?.message} {...register("headline")} />
          <Input label="Skills (comma-separated)" placeholder="React, Node.js, MongoDB" {...register("skills")} />
          <Input label="Resume URL" error={errors.resumeUrl?.message} {...register("resumeUrl")} />
          <Input label="Portfolio URL" error={errors.portfolioUrl?.message} {...register("portfolioUrl")} />
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Education</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ degree: "", institution: "", year: undefined })}>
              Add
            </Button>
          </div>
          {eduFields.map((field, i) => (
            <div key={field.id} className="mt-4 grid gap-3 sm:grid-cols-3 border-t border-border pt-4">
              <Input label="Degree" {...register(`education.${i}.degree`)} />
              <Input label="Institution" {...register(`education.${i}.institution`)} />
              <Input
                label="Year"
                type="number"
                {...register(`education.${i}.year`, {
                  setValueAs: (v) => (v === "" || v === null || isNaN(Number(v)) ? undefined : Number(v)),
                })}
              />
              {eduFields.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeEdu(i)}>Remove</Button>
              )}
            </div>
          ))}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Experience</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ company: "", role: "", startDate: "", endDate: "", description: "" })}>
              Add
            </Button>
          </div>
          {expFields.map((field, i) => (
            <div key={field.id} className="mt-4 space-y-3 border-t border-border pt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Company" {...register(`experience.${i}.company`)} />
                <Input label="Role" {...register(`experience.${i}.role`)} />
                <Input label="Start date" type="date" {...register(`experience.${i}.startDate`)} />
                <Input label="End date" type="date" {...register(`experience.${i}.endDate`)} />
              </div>
              <Input label="Description" {...register(`experience.${i}.description`)} />
              {expFields.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeExp(i)}>Remove</Button>
              )}
            </div>
          ))}
        </Card>

        {error && <p className="text-sm text-danger-text">{error}</p>}
        {success && <p className="text-sm text-accent">{success}</p>}
        <Button type="submit" isLoading={isSubmitting} loadingText="Saving...">Save profile</Button>
      </form>
    </div>
  );
}
