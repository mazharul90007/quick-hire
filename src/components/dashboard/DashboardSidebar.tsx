"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Users,
  Home,
  LogOut,
  X,
  ClipboardList,
  Settings,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DashboardSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Applications", href: "/dashboard/applications", icon: ClipboardList },
    { name: "Industries", href: "/dashboard/categories", icon: Layers },
    { name: "Courses", href: "/dashboard/courses", icon: GraduationCap },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/25 backdrop-blur-[2px] transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-white shadow-sm transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative flex h-full flex-col p-6">
          <div className="mb-10 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="group flex items-center gap-3"
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                <img
                  src="/assets/images/quick-hire-images/quick_hire_logo.png"
                  alt=""
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <span className="font-clash block text-lg font-bold tracking-tight text-zinc-900">
                  QuickHire
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Admin
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Menu
            </p>
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold font-epilogue transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      "shrink-0",
                      active ? "text-primary-foreground" : "text-zinc-400",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-1 border-t border-zinc-200 pt-6">
            <Link
              href="/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-600 transition-colors font-epilogue hover:bg-zinc-100 hover:text-zinc-900"
            >
              <ExternalLink size={18} className="text-zinc-400" />
              Live job board
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-600 transition-colors font-epilogue hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Home size={18} className="text-zinc-400" />
              Marketing site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors font-epilogue hover:bg-rose-50"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>

          {session?.user && (
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="truncate font-epilogue text-xs text-zinc-500">
                Signed in
              </p>
              <p className="truncate font-epilogue text-sm font-semibold text-zinc-900">
                {session.user.name || session.user.email}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
