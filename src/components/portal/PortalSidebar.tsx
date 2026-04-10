"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Home, LogOut, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export type PortalNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

interface PortalSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  subtitle: string;
  basePath: "/applicant" | "/recruiter";
  navItems: PortalNavItem[];
}

export function PortalSidebar({
  isOpen,
  setIsOpen,
  subtitle,
  basePath,
  navItems,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/25 backdrop-blur-[2px] transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      ) : null}

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
              href={basePath}
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
                  {subtitle}
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
                (item.href !== basePath && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 font-epilogue text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      "shrink-0",
                      active ? "text-primary-foreground" : "text-zinc-500",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}

            <Link
              href="/jobs"
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 font-epilogue text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <ExternalLink size={20} className="shrink-0 text-zinc-500" />
              Job board
            </Link>
            <Link
              href="/"
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-epilogue text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Home size={20} className="shrink-0 text-zinc-500" />
              Home
            </Link>
          </nav>

          <div className="mt-auto space-y-3 border-t border-zinc-100 pt-6">
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-3">
              <p className="truncate font-epilogue text-sm font-semibold text-zinc-900">
                {session?.user?.name || "Account"}
              </p>
              <p className="truncate font-epilogue text-xs text-zinc-500">
                {session?.user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-epilogue text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
            >
              <LogOut size={20} />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
