import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { trackRequestEnd, trackRequestStart } from "./loadingManager";

export const TOKEN_KEY = "auth_token";
export const ROLE_KEY = "auth_role";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  trackRequestStart();
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    trackRequestEnd();
    return response;
  },
  (error: AxiosError) => {
    trackRequestEnd();
    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(ROLE_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token: string, role: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: "lax" });
  Cookies.set(ROLE_KEY, role, { expires: 7, sameSite: "lax" });
}

export function clearAuthToken() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}

export function getAuthToken() {
  return Cookies.get(TOKEN_KEY);
}

export function getAuthRole() {
  return Cookies.get(ROLE_KEY);
}
