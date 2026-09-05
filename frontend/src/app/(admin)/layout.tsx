import { Sidebar } from "@/components/layout/Sidebar";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6">
      <Sidebar links={adminLinks} title="Admin" />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
