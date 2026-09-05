import { Sidebar } from "@/components/layout/Sidebar";

const candidateLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/applications", label: "Applications" },
];

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6">
      <Sidebar links={candidateLinks} title="Candidate" />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
