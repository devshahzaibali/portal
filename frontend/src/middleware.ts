import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";

const publicPaths = ["/", "/jobs", "/login", "/register"];
const candidatePaths = ["/dashboard", "/profile", "/applications"];
const recruiterPaths = ["/recruiter", "/company", "/applicants"];
const adminPaths = ["/admin"];

function isPublicPath(pathname: string) {
  if (/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(pathname)) return true;
  if (publicPaths.includes(pathname)) return true;
  if (pathname.startsWith("/jobs/") && !pathname.startsWith("/jobs/new")) return true;
  return false;
}

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;
  const role = request.cookies.get(ROLE_KEY)?.value;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (matchesPrefix(pathname, adminPaths) && role !== "admin") {
    const fallback = role === "recruiter" ? "/recruiter/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  if (matchesPrefix(pathname, recruiterPaths) && role !== "recruiter") {
    const fallback = role === "admin" ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  if (matchesPrefix(pathname, candidatePaths) && role !== "candidate") {
    const fallback = role === "admin" ? "/admin/dashboard" : role === "recruiter" ? "/recruiter/dashboard" : "/login";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
