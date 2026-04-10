/** Normalize Better Auth / DB role strings for comparisons. */
export function normalizeUserRole(role: string | undefined | null): string {
  return String(role ?? "")
    .trim()
    .toUpperCase();
}

/** Roles that may access the admin dashboard (matches server auth). */
export function isStaffAdmin(role: string | undefined | null): boolean {
  const r = normalizeUserRole(role);
  return r === "ADMIN" || r === "SUPER_ADMIN";
}

export function isApplicant(role: string | undefined | null): boolean {
  return normalizeUserRole(role) === "APPLICANT";
}

export function isRecruiter(role: string | undefined | null): boolean {
  return normalizeUserRole(role) === "RECRUITER";
}
