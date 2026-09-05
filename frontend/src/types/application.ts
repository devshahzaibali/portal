export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "offered"
  | "hired"
  | "rejected";

export interface Application {
  _id: string;
  job: import("./job").Job | string;
  candidate: import("./user").User | string;
  fullName?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  portfolioUrl?: string;
  currentRole?: string;
  yearsOfExperience?: number;
  coverNote?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeSource?: "url" | "file";
  status: ApplicationStatus;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyInput {
  fullName: string;
  email: string;
  phone: string;
  linkedIn?: string;
  portfolioUrl?: string;
  currentRole?: string;
  yearsOfExperience?: number;
  coverNote?: string;
  resumeUrl?: string;
}

export interface UpdateApplicationStatusInput {
  status: ApplicationStatus;
}
