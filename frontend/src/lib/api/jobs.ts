import type { ApiResponse, PaginatedData } from "@/constants/routes";
import type { CreateJobInput, Job, JobFilters, UpdateJobInput } from "@/types/job";
import type { Application } from "@/types/application";
import { apiClient } from "./client";

export async function getJobs(filters: JobFilters = {}) {
  const res = await apiClient.get<ApiResponse<PaginatedData<Job>>>("/jobs", { params: filters });
  return res.data.data;
}

export async function getJobById(id: string) {
  const res = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
  return res.data.data;
}

export async function getMyJobs() {
  const res = await apiClient.get<ApiResponse<Job[]>>("/jobs/my-jobs");
  return res.data.data;
}

export async function createJob(data: CreateJobInput) {
  const res = await apiClient.post<ApiResponse<Job>>("/jobs", data);
  return res.data.data;
}

export async function updateJob(id: string, data: UpdateJobInput) {
  const res = await apiClient.patch<ApiResponse<Job>>(`/jobs/${id}`, data);
  return res.data.data;
}

export async function deleteJob(id: string) {
  await apiClient.delete(`/jobs/${id}`);
}

export async function getJobApplications(jobId: string, page = 1, limit = 10) {
  const res = await apiClient.get<ApiResponse<PaginatedData<Application>>>(
    `/jobs/${jobId}/applications`,
    { params: { page, limit } }
  );
  return res.data.data;
}

export async function approveJob(id: string, status: "approved" | "rejected") {
  const res = await apiClient.patch<ApiResponse<Job>>(`/jobs/${id}/approve`, { status });
  return res.data.data;
}
