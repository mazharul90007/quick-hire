"use client";

import Link from "next/link";
import Image from "next/image";
import { X, LogOut, LayoutDashboard, Briefcase, User } from "lucide-react";
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
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 py-0.5"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 p-1 ring-1 ring-primary/20">
              <Image
                src="/assets/images/quick-hire-images/quick_hire_logo.png"
                alt=""
                fill
                className="object-contain p-1"
                sizes="36px"
              />
            </div>
            <span className="font-clash text-base font-bold tracking-tight text-foreground">
              QuickHire
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
                  "rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/50 p-4">
          {session ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-4">
                {session.user.image ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/20">
                    <User size={20} strokeWidth={2.5} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground font-clash">
                    {session.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground font-epilogue mt-0.5">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {isStaffAdmin(session.user.role) && (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                    pathname === "/dashboard"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
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
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                    pathname.startsWith("/recruiter")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
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
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                    pathname.startsWith("/applicant")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
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
                className="h-11 w-full rounded-xl border-destructive/20 font-bold text-destructive hover:bg-destructive/5 hover:text-destructive shadow-sm"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/signup" onClick={onClose} className="w-full">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-xl border-border/50 font-bold text-primary hover:bg-primary/5 shadow-sm"
                >
                  Post a job
                </Button>
              </Link>
              <Link href="/login" onClick={onClose} className="w-full">
                <Button
                  variant="ghost"
                  className="h-11 w-full rounded-xl font-bold text-muted-foreground hover:text-foreground transition-all"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" onClick={onClose} className="w-full">
                <Button className="h-11 w-full rounded-xl bg-primary hover:brightness-110 text-white font-bold shadow-lg shadow-primary/20 transition-all">
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
