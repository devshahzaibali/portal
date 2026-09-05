export function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSalary(min?: number, max?: number) {
  if (!min && !max) return "Not disclosed";
  if (min && max) return `${min.toLocaleString()} – ${max.toLocaleString()}`;
  if (min) return `From ${min.toLocaleString()}`;
  return `Up to ${max!.toLocaleString()}`;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || "Something went wrong";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
