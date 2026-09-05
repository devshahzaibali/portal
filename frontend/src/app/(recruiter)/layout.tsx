import { Sidebar } from "@/components/layout/Sidebar";

const recruiterLinks = [
  { href: "/recruiter/dashboard", label: "Dashboard" },
  { href: "/company", label: "Company" },
  { href: "/recruiter/jobs", label: "My Jobs" },
];

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6">
      <Sidebar links={recruiterLinks} title="Recruiter" />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
