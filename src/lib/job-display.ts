import type { Job } from "@/types";

export function jobCompanyName(job: Job): string {
  return (
    job.recruiter?.companyName ||
    job.recruiter?.recruiterName ||
    "Company"
  );
}

export function jobCompanyLogo(job: Job): string {
  const u = job.recruiter?.companyLogo;
  if (u && (u.startsWith("http") || u.startsWith("/"))) return u;
  if (u) return u;
  return "/assets/images/no-image.svg";
}

/** Human-readable labels for API enums */
export function formatJobType(t: string | undefined | null): string {
  if (!t) return "";
  const m: Record<string, string> = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };
  return m[t] || String(t).replaceAll("_", " ");
}

export function formatEmploymentType(t: string | undefined | null): string {
  if (!t) return "";
  return String(t)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
