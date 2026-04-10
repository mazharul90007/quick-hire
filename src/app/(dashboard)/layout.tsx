"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Menu } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { cn } from "@/lib/utils";
import { isStaffAdmin } from "@/lib/roles";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role as string | undefined;
    if (!isPending && (!session || !isStaffAdmin(role))) {
      router.push("/");
    }

    // Auto-close sidebar on mobile
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || !isStaffAdmin((session.user as any).role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f6f4] lg:flex-row">
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200/80 bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)] lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="-ml-2 rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/quick-hire-images/quick_hire_logo.png"
                alt="QuickHire"
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
              className="pointer-events-none fixed inset-0 lg:left-72"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 90% 60% at 80% -10%, rgba(24, 24, 27, 0.04), transparent 55%)",
              }}
            />
            <div className="relative z-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
