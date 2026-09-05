import { Card } from "@/components/ui/Card";
import { getResumeHref } from "@/lib/api/applications";
import type { Application } from "@/types/application";

interface ApplicationProfileCardProps {
  application: Application;
  showResume?: boolean;
}

export function ApplicationProfileCard({ application, showResume = true }: ApplicationProfileCardProps) {
  const resumeHref = getResumeHref(application.resumeUrl);

  const fields = [
    { label: "Full name", value: application.fullName },
    { label: "Email", value: application.email },
    { label: "Phone", value: application.phone },
    { label: "Current role", value: application.currentRole },
    {
      label: "Experience",
      value:
        application.yearsOfExperience !== undefined
          ? `${application.yearsOfExperience} year${application.yearsOfExperience === 1 ? "" : "s"}`
          : undefined,
    },
    { label: "LinkedIn", value: application.linkedIn, isLink: true },
    { label: "Portfolio", value: application.portfolioUrl, isLink: true },
  ].filter((f) => f.value);

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border bg-accent/5 px-6 py-4">
        <h2 className="font-display text-lg font-semibold">Applicant profile</h2>
        <p className="mt-1 text-sm text-muted">Details submitted with this application</p>
      </div>
      <dl className="grid gap-4 px-6 py-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">{field.label}</dt>
            <dd className="mt-1 text-sm font-medium">
              {field.isLink ? (
                <a
                  href={field.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline break-all"
                >
                  {field.value}
                </a>
              ) : (
                field.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      {showResume && application.resumeUrl && (
        <div className="border-t border-border px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Resume</p>
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9.09 9.09 0 00-1.5-.75M8.25 21h8.25" />
            </svg>
            {application.resumeFileName || "View resume"}
            {application.resumeSource === "file" && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Uploaded</span>
            )}
          </a>
        </div>
      )}
    </Card>
  );
}
