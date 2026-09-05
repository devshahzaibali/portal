"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth/useAuth";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

const HOME_LINKS = [
  { href: "/#openings", label: "Openings" },
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about", label: "About" },
];

function NavLink({ href, active, isTransparentHero, children, onClick }: { href: string; active: boolean; isTransparentHero?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="group relative py-1">
      <span
        className={cn(
          "text-sm font-semibold transition-colors duration-200",
          active
            ? "text-orange-500"
            : isTransparentHero
              ? "text-white/95 hover:text-orange-400"
              : "text-zinc-800 hover:text-orange-600"
        )}
      >
        {children}
      </span>
      <motion.span
        className="absolute -bottom-0.5 left-0 h-0.5 bg-orange-500 rounded-full"
        initial={false}
        animate={{ width: active ? "100%" : "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </Link>
  );
}

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  const isHome = pathname === "/";
  const isTransparentHero = isHome && !scrolled;

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isHome && "-mb-16 lg:-mb-20",
        scrolled || !isHome
          ? "border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl shadow-xs"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20">
        <BrandLogo
          size="md"
          className={isTransparentHero ? "[&>span]:text-white" : ""}
        />

        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink
            href="/jobs"
            active={pathname.startsWith("/jobs") && !pathname.startsWith("/recruiter")}
            isTransparentHero={isTransparentHero}
          >
            Browse Jobs
          </NavLink>
          {HOME_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={false}
              isTransparentHero={isTransparentHero}
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === "candidate" && (
            <NavLink href="/applications" active={pathname.startsWith("/applications")} isTransparentHero={isTransparentHero}>
              My Applications
            </NavLink>
          )}
          {user?.role === "recruiter" && (
            <NavLink href="/recruiter/jobs" active={pathname.startsWith("/recruiter")} isTransparentHero={isTransparentHero}>
              Manage Postings
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="hidden items-center gap-2.5 md:flex">
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse-flat rounded-xl bg-border" />
            ) : user ? (
              <>
                <Link href={
                  user.role === "admin" ? "/admin/dashboard"
                    : user.role === "recruiter" ? "/recruiter/dashboard"
                    : "/dashboard"
                }>
                  <Button
                    variant={isTransparentHero ? "outline" : "ghost"}
                    size="sm"
                    className={isTransparentHero ? "border-white/30 bg-black/30 text-white hover:bg-black/50" : ""}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className={isTransparentHero ? "border-white/30 bg-black/30 text-white hover:bg-black/50" : ""}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                {!isLogin && (
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={isTransparentHero ? "text-white hover:text-orange-400 hover:bg-white/10" : ""}
                    >
                      Sign in
                    </Button>
                  </Link>
                )}
                {!isRegister && (
                  <Link href="/register">
                    <Button size="sm" className="font-bold shadow-md">
                      Get started
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-sm lg:hidden transition-colors",
              isTransparentHero
                ? "border-white/30 bg-black/30 text-white"
                : "border-border bg-surface/80 text-foreground"
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((p) => !p)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6 bg-white"
            >
              <motion.div variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}>
                <Link
                  href="/jobs"
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    pathname.startsWith("/jobs") && !pathname.startsWith("/recruiter")
                      ? "bg-orange-50 text-orange-600"
                      : "text-zinc-800 hover:bg-zinc-100"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  Browse Jobs
                </Link>
              </motion.div>
              {HOME_LINKS.map((link) => (
                <motion.div key={link.href} variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user?.role === "candidate" && (
                <motion.div variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}>
                  <Link href="/applications" className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>
                    My Applications
                  </Link>
                </motion.div>
              )}
              {user?.role === "recruiter" && (
                <motion.div variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}>
                  <Link href="/recruiter/jobs" className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>
                    Manage Postings
                  </Link>
                </motion.div>
              )}
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4 md:hidden">
                {isLoading ? (
                  <div className="h-10 animate-pulse-flat rounded-lg bg-border" />
                ) : user ? (
                  <>
                    <Link href={user.role === "admin" ? "/admin/dashboard" : user.role === "recruiter" ? "/recruiter/dashboard" : "/dashboard"} onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">Dashboard</Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full" onClick={logout}>Sign out</Button>
                  </>
                ) : (
                  <>
                    {!isLogin && (
                      <Link href="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm" className="w-full">Sign in</Button></Link>
                    )}
                    {!isRegister && (
                      <Link href="/register" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">Get started</Button></Link>
                    )}
                  </>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
