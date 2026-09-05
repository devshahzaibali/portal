export type JobType = "full-time" | "part-time" | "internship" | "contract";
export type WorkMode = "remote" | "onsite" | "hybrid";
export type JobStatus = "pending" | "approved" | "rejected" | "closed";

export interface CompanyRef {
  _id: string;
  name: string;
  location?: string;
  website?: string;
}

export interface Job {
  _id: string;
  company: CompanyRef | string;
  recruiter: string;
  title: string;
  description: string;
  skills: string[];
  type: JobType;
  workMode: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  deadline: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  keyword?: string;
  location?: string;
  workMode?: WorkMode;
  type?: JobType;
  skills?: string;
  page?: number;
  limit?: number;
}

export interface CreateJobInput {
  title: string;
  description: string;
  skills?: string[];
  type: JobType;
  workMode: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  deadline: string;
}

export type UpdateJobInput = Partial<CreateJobInput>;
