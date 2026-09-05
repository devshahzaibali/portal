"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LoadingOverlay } from "@/components/ui/Spinner";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { applyToJob } from "@/lib/api/applications";
import { useAuth } from "@/lib/auth/useAuth";
import { getErrorMessage } from "@/lib/utils";

const STEPS = ["Personal", "Professional", "Resume & Cover"] as const;

const applySchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(7, "Phone number is required"),
    linkedIn: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    currentRole: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    coverNote: z.string().min(30, "Cover letter must be at least 30 characters"),
    resumeMode: z.enum(["file", "url"]),
    resumeUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.resumeMode === "url") {
      if (!data.resumeUrl?.trim()) {
        ctx.addIssue({ code: "custom", message: "Resume URL is required", path: ["resumeUrl"] });
      } else {
        try {
          new URL(data.resumeUrl);
        } catch {
          ctx.addIssue({ code: "custom", message: "Must be a valid URL", path: ["resumeUrl"] });
        }
      }
    }
  });

type ApplyForm = z.infer<typeof applySchema>;

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName?: string;
  onSuccess: () => void;
}

export function ApplyModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  onSuccess,
}: ApplyModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyForm>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      resumeMode: "file",
      yearsOfExperience: "0",
    },
  });

  const resumeMode = watch("resumeMode");

  useEffect(() => {
    if (isOpen && user) {
      reset({
        fullName: user.name || "",
        email: user.email || "",
        phone: "",
        linkedIn: "",
        portfolioUrl: "",
        currentRole: "",
        yearsOfExperience: "0",
        coverNote: "",
        resumeMode: "file",
        resumeUrl: "",
      });
      setStep(0);
      setResumeFile(null);
      setError("");
      setFileError("");
    }
  }, [isOpen, user, reset]);

  const stepFields: (keyof ApplyForm)[][] = [
    ["fullName", "email", "phone", "linkedIn"],
    ["currentRole", "yearsOfExperience", "portfolioUrl"],
    ["coverNote", "resumeUrl"],
  ];

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: ApplyForm) => {
    setError("");
    setFileError("");

    if (data.resumeMode === "file" && !resumeFile) {
      setFileError("Please upload your resume or switch to URL");
      return;
    }

    try {
      await applyToJob(
        jobId,
        {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          linkedIn: data.linkedIn || undefined,
          portfolioUrl: data.portfolioUrl || undefined,
          currentRole: data.currentRole || undefined,
          yearsOfExperience: data.yearsOfExperience
            ? Number(data.yearsOfExperience)
            : undefined,
          coverNote: data.coverNote,
          resumeUrl: data.resumeMode === "url" ? data.resumeUrl : undefined,
        },
        data.resumeMode === "file" ? resumeFile : null
      );
      reset();
      setResumeFile(null);
      onSuccess();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      className="overflow-hidden p-0"
    >
      <div className="border-b border-border bg-surface px-6 py-5 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">Apply for position</p>
        <h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">{jobTitle}</h2>
        {companyName && <p className="mt-1 text-sm text-muted">{companyName}</p>}

        <div className="mt-6 flex gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col gap-2">
              <div
                className={`h-1 rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-accent" : "bg-border"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  i === step ? "text-accent" : i < step ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative px-6 py-6 sm:px-8">
        <LoadingOverlay show={isSubmitting} message="Submitting your application..." />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted">Tell us how to reach you.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Full name *"
                    placeholder="Jane Doe"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="jane@email.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Phone *"
                    placeholder="+1 555 000 0000"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                  <Input
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/you"
                    error={errors.linkedIn?.message}
                    {...register("linkedIn")}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted">Share your professional background.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Current role / title"
                    placeholder="Software Engineering Intern"
                    error={errors.currentRole?.message}
                    {...register("currentRole")}
                  />
                  <Select
                    label="Years of experience"
                    options={[
                      { value: "0", label: "Less than 1 year" },
                      { value: "1", label: "1 year" },
                      { value: "2", label: "2 years" },
                      { value: "3", label: "3 years" },
                      { value: "5", label: "5+ years" },
                      { value: "10", label: "10+ years" },
                    ]}
                    error={errors.yearsOfExperience?.message}
                    {...register("yearsOfExperience")}
                  />
                </div>
                <Input
                  label="Portfolio / GitHub URL"
                  placeholder="https://github.com/you"
                  error={errors.portfolioUrl?.message}
                  {...register("portfolioUrl")}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <Textarea
                  label="Cover letter *"
                  placeholder="Explain why you're a great fit for this role, your relevant skills, and what excites you about the opportunity..."
                  hint="Minimum 30 characters — be specific about this role."
                  error={errors.coverNote?.message}
                  {...register("coverNote")}
                />

                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Resume *</p>
                  <div className="mb-4 flex rounded-lg border border-border bg-surface p-1">
                    <button
                      type="button"
                      onClick={() => setValue("resumeMode", "file", { shouldValidate: true })}
                      className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        resumeMode === "file"
                          ? "bg-accent text-white"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      Upload file
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("resumeMode", "url", { shouldValidate: true })}
                      className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        resumeMode === "url"
                          ? "bg-accent text-white"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      Paste URL
                    </button>
                  </div>
                  <input type="hidden" {...register("resumeMode")} />

                  {resumeMode === "file" ? (
                    <FileUpload
                      file={resumeFile}
                      onFileChange={setResumeFile}
                      error={fileError}
                    />
                  ) : (
                    <Input
                      placeholder="https://drive.google.com/your-resume.pdf"
                      error={errors.resumeUrl?.message}
                      {...register("resumeUrl")}
                    />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-4 rounded-md border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger-text">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          <div className="flex gap-3">
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext} className="w-full sm:w-auto">
                Continue
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting} loadingText="Submitting..." className="w-full sm:w-auto">
                Submit application
              </Button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
