import type { ApiResponse, PaginatedData } from "@/constants/routes";
import type {
  Application,
  ApplyInput,
  UpdateApplicationStatusInput,
} from "@/types/application";
import { apiClient } from "./client";

export async function applyToJob(jobId: string, data: ApplyInput, resumeFile?: File | null) {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  if (data.linkedIn) formData.append("linkedIn", data.linkedIn);
  if (data.portfolioUrl) formData.append("portfolioUrl", data.portfolioUrl);
  if (data.currentRole) formData.append("currentRole", data.currentRole);
  if (data.yearsOfExperience !== undefined) {
    formData.append("yearsOfExperience", String(data.yearsOfExperience));
  }
  if (data.coverNote) formData.append("coverNote", data.coverNote);
  if (data.resumeUrl) formData.append("resumeUrl", data.resumeUrl);
  if (resumeFile) formData.append("resume", resumeFile);

  const res = await apiClient.post<ApiResponse<Application>>(
    `/applications/jobs/${jobId}/apply`,
    formData
  );
  return res.data.data;
}

export async function getMyApplications(page = 1, limit = 10) {
  const res = await apiClient.get<ApiResponse<PaginatedData<Application>>>(
    "/applications/my-applications",
    { params: { page, limit } }
  );
  return res.data.data;
}

export async function getApplicationById(id: string) {
  const res = await apiClient.get<ApiResponse<Application>>(`/applications/${id}`);
  return res.data.data;
}

export async function updateApplicationStatus(id: string, data: UpdateApplicationStatusInput) {
  const res = await apiClient.patch<ApiResponse<Application>>(
    `/applications/${id}/status`,
    data
  );
  return res.data.data;
}

export function getResumeHref(resumeUrl?: string) {
  if (!resumeUrl) return "";
  if (resumeUrl.startsWith("http")) return resumeUrl;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/api$/, "");
  return `${base}${resumeUrl.startsWith("/") ? resumeUrl : `/${resumeUrl}`}`;
}
