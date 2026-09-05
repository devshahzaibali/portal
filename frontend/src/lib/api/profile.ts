import type { ApiResponse } from "@/constants/routes";
import type { CandidateProfile, UpdateProfileInput } from "@/types/profile";
import { apiClient } from "./client";

export async function getProfile() {
  const res = await apiClient.get<ApiResponse<CandidateProfile>>("/profile");
  return res.data.data;
}

export async function updateProfile(data: UpdateProfileInput) {
  const res = await apiClient.patch<ApiResponse<CandidateProfile>>("/profile", data);
  return res.data.data;
}
