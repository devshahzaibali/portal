"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { createCompany, getMyCompany, updateCompany } from "@/lib/api/companies";
import type { Company } from "@/types/company";
import { getErrorMessage } from "@/lib/utils";

const companySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  website: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  description: z.string().optional(),
});

type CompanyForm = z.infer<typeof companySchema>;

export default function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    getMyCompany()
      .then((c) => {
        setCompany(c);
        reset({
          name: c.name,
          website: c.website || "",
          location: c.location || "",
          description: c.description || "",
        });
      })
      .catch(() => setCompany(null))
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (data: CompanyForm) => {
    setError("");
    setSuccess("");
    try {
      if (company) {
        const updated = await updateCompany(company._id, data);
        setCompany(updated);
        setSuccess("Company updated. It will need re-approval if previously approved.");
      } else {
        const created = await createCompany(data);
        setCompany(created);
        setSuccess("Company created. Awaiting admin approval.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <FormSkeleton />
        <PageLoader message="Loading company..." />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="font-display text-3xl font-semibold">Company</h1>
        {company && (
          <Badge variant={company.approvalStatus === "approved" ? "success" : "warning"}>
            {company.approvalStatus}
          </Badge>
        )}
      </div>
      <p className="mt-2 text-muted">
        {company ? "Manage your company profile" : "Set up your company to start posting jobs"}
      </p>
      {company?.approvalStatus === "approved" && (
        <p className="mt-2 text-xs text-muted">
          Editing an approved company resets it to pending review.
        </p>
      )}
      <Card className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Company name" error={errors.name?.message} {...register("name")} />
          <Input label="Website" error={errors.website?.message} {...register("website")} />
          <Input label="Location" {...register("location")} />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
              rows={4}
              {...register("description")}
            />
          </div>
          {error && <p className="text-sm text-danger-text">{error}</p>}
          {success && <p className="text-sm text-accent">{success}</p>}
          <Button type="submit" isLoading={isSubmitting} loadingText={company ? "Updating..." : "Creating..."}>
            {company ? "Update company" : "Create company"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
