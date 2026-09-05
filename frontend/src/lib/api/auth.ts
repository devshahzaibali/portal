import type { ApiResponse } from "@/constants/routes";
import type { AuthResponse, LoginInput, RegisterInput, User } from "@/types/user";
import { apiClient, clearAuthToken, setAuthToken } from "./client";

export async function register(data: RegisterInput) {
  const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data);
  const { token, user } = res.data.data;
  setAuthToken(token, user.role);
  return res.data.data;
}

export async function login(data: LoginInput) {
  const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data);
  const { token, user } = res.data.data;
  setAuthToken(token, user.role);
  return res.data.data;
}

export async function getMe() {
  const res = await apiClient.get<ApiResponse<User>>("/auth/me");
  return res.data.data;
}

export function logout() {
  clearAuthToken();
}
