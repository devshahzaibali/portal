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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["candidate", "recruiter"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "candidate" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    try {
      await registerUser(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <AuthSplitLayout mode="register">
      <div className="w-full max-w-sm mx-auto">
        {/* Clean, Elegant Heading */}
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
            Create account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 font-medium">
            Join the verified platform and start your journey
          </p>
        </div>

        {/* Role Switcher */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            I am joining as:
          </label>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => setValue("role", "candidate")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                selectedRole === "candidate"
                  ? "bg-white text-orange-600 shadow-xs border border-zinc-200/80"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              🎓 Candidate / Student
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "recruiter")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                selectedRole === "recruiter"
                  ? "bg-white text-orange-600 shadow-xs border border-zinc-200/80"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              🏢 Employer / Recruiter
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="e.g. Jane Doe"
              {...register("name")}
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-400 focus:ring-red-400/20"
                  : "border-zinc-200/90 focus:border-orange-500 focus:ring-orange-500/15"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400/20"
                  : "border-zinc-200/90 focus:border-orange-500 focus:ring-orange-500/15"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                {...register("password")}
                className={`w-full rounded-xl border bg-white px-4 py-2.5 pr-12 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:ring-2 ${
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

          {/* Terms notice */}
          <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
            By creating an account, you agree to our{" "}
            <Link href="/#about" className="text-zinc-600 underline hover:text-zinc-900">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/#about" className="text-zinc-600 underline hover:text-zinc-900">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange-600 py-3 px-4 text-sm font-bold text-white shadow-md shadow-orange-600/15 hover:bg-orange-500 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Clean Switcher to Sign In */}
        <div className="mt-5 text-center pt-4 border-t border-zinc-100">
          <p className="text-xs text-zinc-500 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
