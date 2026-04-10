/** Same origin as Better Auth (`/api/auth/*` on the API server). */
function authServerOrigin(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || "";
  if (!url) return "https://quick-hire-server.onrender.com";
  return url.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
}

function norm(r: string | undefined) {
  return String(r ?? "")
    .trim()
    .toUpperCase();
}

/**
 * Fetches `/api/auth/get-session` with cookies to read `user.role` after sign-in.
 */
export async function getPostLoginDashboardPath(): Promise<string> {
  const origin = authServerOrigin();
  try {
    const res = await fetch(`${origin}/api/auth/get-session`, {
      credentials: "include",
    });
    if (!res.ok) return "/";
    const body = (await res.json()) as { user?: { role?: string } } | null;
    const role = norm(body?.user?.role);
    if (!role) return "/";
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "/dashboard";
    if (role === "RECRUITER") return "/recruiter";
    if (role === "APPLICANT") return "/applicant";
    return "/";
  } catch {
    return "/";
  }
}
