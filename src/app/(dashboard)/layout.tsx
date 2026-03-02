"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Menu } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { cn } from "@/lib/utils";

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
    if (!isPending && (!session || (session.user as any).role !== "ADMIN")) {
      router.push("/");
    }

    // Auto-close sidebar on mobile
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || (session.user as any).role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row">
      {/* Sidebar Overlay */}
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Top Header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-zinc-200 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/brand-logo.svg"
                alt="QuickHire"
                className="w-7 h-7"
              />
              <span className="font-bold text-lg text-zinc-900 font-clash">
                QuickHire
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "lg:ml-72" : "ml-0"
          )}
        >
          <div className="p-4 md:p-8 lg:p-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
