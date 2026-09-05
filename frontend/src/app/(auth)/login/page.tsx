"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { useAuth } from "@/lib/auth/useAuth";
import { getErrorMessage } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    try {
      await login(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthSplitLayout mode="login">
      <div className="w-full max-w-sm mx-auto">
        {/* Clean, Elegant Heading */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 font-medium">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400/20"
                  : "border-zinc-200/90 focus:border-orange-500 focus:ring-orange-500/15"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset instructions will be sent to your registered email.")}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-400/20"
                    : "border-zinc-200/90 focus:border-orange-500 focus:ring-orange-500/15"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange-600 py-3 px-4 text-sm font-bold text-white shadow-md shadow-orange-600/15 hover:bg-orange-500 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer mt-2"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Clean Switcher to Sign Up */}
        <div className="mt-6 text-center pt-4 border-t border-zinc-100">
          <p className="text-xs text-zinc-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
