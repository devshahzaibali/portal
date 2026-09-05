export interface Education {
  degree?: string;
  institution?: string;
  year?: number;
}

export interface Experience {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface CandidateProfile {
  _id: string;
  user: string;
  headline?: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  resumeUrl?: string;
  portfolioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  headline?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  resumeUrl?: string;
  portfolioUrl?: string;
}
