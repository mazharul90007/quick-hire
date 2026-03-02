"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Users,
  ChevronLeft,
  Menu,
  Home,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DashboardSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Manage Categories", href: "/dashboard/categories", icon: Layers },
    { name: "Manage Users", href: "/dashboard/users", icon: Users },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}


      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 bg-[#202430] text-white transition-all duration-300 ease-in-out overflow-y-auto",
          isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-0",
        )}
      >
        <div className="p-8 flex flex-col h-full">
          {/* Brand & Close Button */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2">
                <Image
                  src="/assets/images/brand-logo.svg"
                  alt="QuickHire"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold font-clash tracking-tight">
                QuickHire
              </span>
            </div>

            {/* Close Button (Mobile Only) */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close Sidebar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 font-epilogue font-bold text-sm transition-all group",
                    isActive
                      ? "bg-[#4640DE] text-white shadow-lg shadow-[#4640DE]/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800",
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-white"
                        : "text-zinc-500 group-hover:text-white",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="pt-8 mt-8 border-t border-zinc-800 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-4 px-4 py-3 font-epilogue font-bold text-sm text-zinc-400 hover:text-white transition-all"
            >
              <Home size={20} />
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 font-epilogue font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all rounded-none"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
