const JOB_IDS_KEY = "recruiter_job_ids";

export function getStoredJobIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(JOB_IDS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addStoredJobId(id: string) {
  const ids = getStoredJobIds();
  if (!ids.includes(id)) {
    localStorage.setItem(JOB_IDS_KEY, JSON.stringify([id, ...ids]));
  }
}
