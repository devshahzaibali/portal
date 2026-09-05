export type UserRole = "candidate" | "recruiter" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "recruiter";
}

export interface LoginInput {
  email: string;
  password: string;
}
