"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/api/auth";
import { clearAuthToken, getAuthToken } from "@/lib/api/client";
import type { LoginInput, RegisterInput, User, UserRole } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      clearAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    refreshUser();
  }, [refreshUser]);

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authApi.login(data);
      setUser(loggedInUser);
      const dest =
        loggedInUser.role === "admin"
          ? "/admin/dashboard"
          : loggedInUser.role === "recruiter"
            ? "/recruiter/dashboard"
            : "/dashboard";
      router.push(dest);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const { user: registeredUser } = await authApi.register(data);
      setUser(registeredUser);
      const dest =
        registeredUser.role === "recruiter" ? "/recruiter/dashboard" : "/dashboard";
      router.push(dest);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    router.push("/login");
  };

  const value = useMemo(
    () => ({
      user,
      token: getAuthToken() || null,
      role: user?.role || null,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
