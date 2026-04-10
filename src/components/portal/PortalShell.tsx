"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Menu } from "lucide-react";
import { PortalSidebar, type PortalNavItem } from "./PortalSidebar";
import { cn } from "@/lib/utils";
import { normalizeUserRole } from "@/lib/roles";

type PortalRole = "APPLICANT" | "RECRUITER";

export function PortalShell({
  children,
  allowedRole,
  subtitle,
  basePath,
  navItems,
}: {
  children: React.ReactNode;
  allowedRole: PortalRole;
  subtitle: string;
  basePath: "/applicant" | "/recruiter";
  navItems: PortalNavItem[];
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  /** Mobile drawer closed by default; desktop uses `lg:translate-x-0` in the sidebar. */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roleRaw = (session?.user as any)?.role as string | undefined;
  const role = normalizeUserRole(roleRaw);

  useEffect(() => {
    if (isPending) return;
    if (!session || role !== allowedRole) {
      router.replace("/login");
    }
  }, [session, isPending, role, allowedRole, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f6f4]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" />
      </div>
    );
  }

  if (!session || role !== allowedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f6f4] font-epilogue text-sm text-zinc-500">
        Redirecting to sign in…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f6f4] lg:flex-row">
      <PortalSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        subtitle={subtitle}
        basePath={basePath}
        navItems={navItems}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200/80 bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)] lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="-ml-2 rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/quick-hire-images/quick_hire_logo.png"
                alt=""
                className="h-7 w-7 object-contain"
              />
              <span className="font-clash text-lg font-bold text-zinc-900">
                QuickHire
              </span>
            </div>
          </div>
        </header>

        <main className="relative min-h-screen flex-1 transition-all duration-300 lg:ml-72">
          <div className="relative min-h-full p-4 md:p-8 lg:p-10">
            <div
              className={cn(
                "pointer-events-none fixed inset-0 lg:left-72",
                "opacity-60",
              )}
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 90% 60% at 80% -10%, rgba(70, 64, 222, 0.06), transparent 55%)",
              }}
            />
            <div className="relative z-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
