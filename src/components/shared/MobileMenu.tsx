"use client";

import Link from "next/link";
import Image from "next/image";
import { X, LogOut, LayoutDashboard, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isApplicant, isRecruiter, isStaffAdmin } from "@/lib/roles";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  onLogout: () => Promise<void>;
  pathname: string;
}

const MobileMenu = ({
  isOpen,
  onClose,
  links,
  session,
  onLogout,
  pathname,
}: MobileMenuProps) => {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-60 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-70 flex w-[min(100%,320px)] flex-col border-l border-border bg-background shadow-xl transition-transform duration-200 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 py-0.5"
          >
            <span className="relative block h-8 w-9 shrink-0">
              <Image
                src="/assets/images/quick-hire-images/quick_hire_logo.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="36px"
              />
            </span>
            <span className="font-clash text-base font-semibold tracking-tight text-foreground">
              QuickHire
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-lg"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Mobile">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          {session ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/40 px-3 py-3">
                <p className="truncate text-sm font-semibold text-foreground">
                  {session.user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>

              {isStaffAdmin(session.user.role) && (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === "/dashboard"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <LayoutDashboard className="size-4 shrink-0" />
                  Admin dashboard
                </Link>
              )}
              {isRecruiter(session.user.role) && (
                <Link
                  href="/recruiter"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname.startsWith("/recruiter")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <LayoutDashboard className="size-4 shrink-0" />
                  Recruiter hub
                </Link>
              )}
              {isApplicant(session.user.role) && (
                <Link
                  href="/applicant"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname.startsWith("/applicant")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <LayoutDashboard className="size-4 shrink-0" />
                  Applicant hub
                </Link>
              )}

              <Button
                onClick={() => {
                  void onLogout();
                  onClose();
                }}
                variant="outline"
                className="h-10 w-full rounded-lg border-destructive/20 font-medium text-destructive hover:bg-destructive/5 hover:text-destructive"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/signup" onClick={onClose}>
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-lg font-medium shadow-none"
                >
                  <Briefcase className="size-4" />
                  Post a job
                </Button>
              </Link>
              <Link href="/login" onClick={onClose}>
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-lg font-medium shadow-none"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" onClick={onClose}>
                <Button className="h-10 w-full rounded-lg font-semibold shadow-sm">
                  Create account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
