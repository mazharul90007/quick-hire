/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Briefcase,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { authClient } from "@/lib/auth-client";
import { isApplicant, isRecruiter, isStaffAdmin } from "@/lib/roles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function initialsFromName(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- avoid SSR/session UI mismatch
    setHasMounted(true);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find jobs", href: "/jobs" },
    { name: "Blog", href: "/blogs" },
    { name: "Courses", href: "/courses" },
    { name: "Companies", href: "/companies" },
    { name: "Contact us", href: "/contact" },
  ];

  const userInitials = useMemo(
    () => initialsFromName(session?.user?.name),
    [session?.user?.name],
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[box-shadow,background-color,border-color] duration-200",
          "border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80",
          isScrolled || isMobileMenuOpen
            ? "border-border shadow-sm"
            : "border-transparent shadow-none",
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 rounded-md py-1 outline-none transition-transform hover:scale-105"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 p-1.5 ring-1 ring-primary/20">
              <Image
                src="/assets/images/quick-hire-images/quick_hire_logo.png"
                alt=""
                fill
                className="object-contain p-1.5"
                sizes="40px"
                priority
              />
            </div>
            <span className="font-clash text-lg font-bold tracking-tight text-foreground sm:text-xl">
              QuickHire
            </span>
          </Link>

          <nav
            className="hidden flex-1 justify-center lg:flex"
            aria-label="Main"
          >
            <ul className="flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "group relative px-4 py-2 text-sm font-semibold transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      {link.name}
                      <span
                        className={cn(
                          "absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-primary transition-all duration-300",
                          isActive ? "opacity-100 scale-100" : "opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-75",
                        )}
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {!hasMounted || isPending ? (
              <div className="hidden h-9 w-40 animate-pulse rounded-lg bg-muted sm:block" />
            ) : session ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 gap-2 rounded-xl border-border/50 bg-card/50 px-2.5 shadow-sm transition-all hover:bg-muted/50 sm:pl-2 sm:pr-3"
                    >
                      {session.user.image ? (
                        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg">
                           <Image
                            src={session.user.image}
                            alt={session.user.name ?? "User"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/20">
                          <User size={14} strokeWidth={3} />
                        </span>
                      )}
                      <span className="hidden max-w-[140px] truncate text-left text-sm font-semibold sm:inline text-foreground">
                        {session.user.name}
                      </span>
                      <ChevronDown
                        className="hidden size-4 shrink-0 text-muted-foreground sm:block"
                        aria-hidden
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 rounded-xl p-2 shadow-2xl">
                    <DropdownMenuLabel className="font-normal px-2 py-3">
                      <p className="truncate text-sm font-bold text-foreground">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    {isStaffAdmin((session.user as any).role) && (
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 font-semibold text-foreground">
                          <LayoutDashboard size={16} className="mr-3 text-primary" />
                          Admin dashboard
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {isRecruiter((session.user as any).role) && (
                      <Link href="/recruiter">
                        <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 font-semibold text-foreground">
                          <LayoutDashboard size={16} className="mr-3 text-primary" />
                          Recruiter hub
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {isApplicant((session.user as any).role) && (
                      <Link href="/applicant">
                        <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 font-semibold text-foreground">
                          <LayoutDashboard size={16} className="mr-3 text-primary" />
                          Applicant hub
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg py-2.5 font-semibold text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/signup">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 rounded-xl px-4 font-bold text-primary hover:bg-primary/10 transition-all"
                  >
                    Post a job
                  </Button>
                </Link>
                <div className="h-4 w-px bg-border/50 mx-1" />
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 rounded-xl px-4 font-bold text-muted-foreground hover:text-foreground transition-all"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="h-10 bg-primary hover:brightness-110 text-white rounded-xl px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Create account
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
        session={!hasMounted || isPending ? null : session}
        onLogout={handleLogout}
        pathname={pathname}
      />
    </>
  );
};

export default Navbar;
