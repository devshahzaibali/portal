import type { ApiResponse } from "@/constants/routes";
import type { Interview, ScheduleInterviewInput, UpdateInterviewInput } from "@/types/interview";
import { apiClient } from "./client";

export async function scheduleInterview(applicationId: string, data: ScheduleInterviewInput) {
  const res = await apiClient.post<ApiResponse<Interview>>(
    `/interviews/applications/${applicationId}/interview`,
    data
  );
  return res.data.data;
}

export async function getInterview(applicationId: string) {
  const res = await apiClient.get<ApiResponse<Interview>>(`/interviews/${applicationId}`);
  return res.data.data;
}

export async function updateInterview(id: string, data: UpdateInterviewInput) {
  const res = await apiClient.patch<ApiResponse<Interview>>(`/interviews/${id}`, data);
  return res.data.data;
}
