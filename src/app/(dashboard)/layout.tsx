"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
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
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-h-screen",
          isSidebarOpen ? "lg:ml-72" : "ml-0",
        )}
      >
        <div className="p-4 md:p-8 lg:p-12">{children}</div>
      </main>
    </div>
  );
}
