import type { ApiResponse } from "@/constants/routes";
import type { Company, CreateCompanyInput, UpdateCompanyInput } from "@/types/company";
import { apiClient } from "./client";

export async function createCompany(data: CreateCompanyInput) {
  const res = await apiClient.post<ApiResponse<Company>>("/companies", data);
  return res.data.data;
}

export async function getMyCompany() {
  const res = await apiClient.get<ApiResponse<Company>>("/companies/my-company");
  return res.data.data;
}

export async function updateCompany(id: string, data: UpdateCompanyInput) {
  const res = await apiClient.patch<ApiResponse<Company>>(`/companies/${id}`, data);
  return res.data.data;
}
