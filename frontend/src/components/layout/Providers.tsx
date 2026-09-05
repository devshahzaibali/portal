"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { LoadingProvider } from "@/lib/loading/LoadingProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider forcedTheme="light" attribute="class" defaultTheme="light" enableSystem={false}>
      <LoadingProvider>
        <AuthProvider>{children}</AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
