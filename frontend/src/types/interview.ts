export type InterviewMode = "online" | "onsite";

export interface Interview {
  _id: string;
  application: string;
  scheduledAt: string;
  mode: InterviewMode;
  meetingDetails?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleInterviewInput {
  scheduledAt: string;
  mode: InterviewMode;
  meetingDetails?: string;
  notes?: string;
}

export type UpdateInterviewInput = Partial<ScheduleInterviewInput>;
