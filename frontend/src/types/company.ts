export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Company {
  _id: string;
  owner: import("./user").User | string;
  name: string;
  website?: string;
  location?: string;
  description?: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyInput {
  name: string;
  website?: string;
  location?: string;
  description?: string;
}

export type UpdateCompanyInput = Partial<CreateCompanyInput>;
