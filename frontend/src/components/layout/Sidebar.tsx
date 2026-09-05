"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  label: string;
}

interface SidebarProps {
  links: SidebarLink[];
  title: string;
}

export function Sidebar({ links, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</p>
      </div>
      <nav className="space-y-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-orange-50 text-orange-600 shadow-xs border border-orange-200/60 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-950"
              )}
            >
              <span>{link.label}</span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
