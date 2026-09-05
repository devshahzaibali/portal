export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  results: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  jobs: "/jobs",
  jobDetail: (id: string) => `/jobs/${id}`,
  candidate: {
    dashboard: "/dashboard",
    profile: "/profile",
    applications: "/applications",
    applicationDetail: (id: string) => `/applications/${id}`,
  },
  recruiter: {
    dashboard: "/dashboard",
    company: "/company",
    jobs: "/jobs",
    newJob: "/jobs/new",
    editJob: (id: string) => `/jobs/${id}/edit`,
    applicants: (id: string) => `/jobs/${id}/applicants`,
    applicantDetail: (id: string) => `/applicants/${id}`,
  },
  admin: {
    dashboard: "/dashboard",
    companies: "/companies",
    jobs: "/jobs",
    users: "/users",
  },
} as const;

export const ROLE_DASHBOARD: Record<string, string> = {
  candidate: "/dashboard",
  recruiter: "/dashboard",
  admin: "/dashboard",
};
