import type { ApiResponse, PaginatedData } from "@/constants/routes";
import type { Company } from "@/types/company";
import type { Job } from "@/types/job";
import type { User } from "@/types/user";
import { apiClient } from "./client";

export async function getAdminCompanies(status?: string) {
  const res = await apiClient.get<ApiResponse<Company[]>>("/admin/companies", {
    params: status ? { status } : undefined,
  });
  return res.data.data;
}

export async function approveCompany(id: string, approvalStatus: "approved" | "rejected") {
  const res = await apiClient.patch<ApiResponse<Company>>(`/admin/companies/${id}/approve`, {
    approvalStatus,
  });
  return res.data.data;
}

export async function getAdminUsers(role?: string, page = 1, limit = 10) {
  const res = await apiClient.get<ApiResponse<PaginatedData<User>>>("/admin/users", {
    params: { role, page, limit },
  });
  return res.data.data;
}

export async function deactivateUser(id: string) {
  const res = await apiClient.patch<ApiResponse<{ _id: string; isActive: boolean }>>(
    `/admin/users/${id}/deactivate`
  );
  return res.data.data;
}

export async function getAdminJobs(status?: string) {
  const res = await apiClient.get<ApiResponse<Job[]>>("/admin/jobs", {
    params: status ? { status } : undefined,
  });
  return res.data.data;
}

export async function getCandidateDashboard() {
  const res = await apiClient.get<ApiResponse<CandidateDashboard>>("/dashboard/candidate");
  return res.data.data;
}

export async function getRecruiterDashboard() {
  const res = await apiClient.get<ApiResponse<RecruiterDashboard>>("/dashboard/recruiter");
  return res.data.data;
}

export async function getAdminDashboard() {
  const res = await apiClient.get<ApiResponse<AdminDashboard>>("/dashboard/admin");
  return res.data.data;
}

import type { Application } from "@/types/application";

export interface CandidateDashboard {
  summaryCards: {
    totalApplications: number;
    shortlisted: number;
    interviewsScheduled: number;
    offersReceived: number;
  };
  applicationsByStatus: Record<string, number>;
  recentApplications: Application[];
}

export interface RecruiterDashboard {
  summaryCards: {
    totalJobs: number;
    totalApplicants: number;
    activeShortlisted: number;
    hired: number;
  };
  applicantsByStatus: Record<string, number>;
  recentApplicants: Application[];
}

export interface AdminDashboard {
  summaryCards: {
    totalUsers: number;
    pendingCompanyApprovals: number;
    pendingJobApprovals: number;
    jobsPostedThisMonth: number;
  };
  usersByRole: Record<string, number>;
}
