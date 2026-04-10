/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Briefcase,
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
            className="flex shrink-0 items-center gap-0.5 rounded-md py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="relative block h-8 w-9 shrink-0 sm:h-9 sm:w-10">
              <Image
                src="/assets/images/quick-hire-images/quick_hire_logo.png"
                alt=""
                fill
                className="object-contain object-left"
                sizes="40px"
                priority
              />
            </span>
            <span className="font-clash text-base font-semibold tracking-tight text-foreground sm:text-lg">
              QuickHire
            </span>
          </Link>

          <nav
            className="hidden flex-1 justify-center lg:flex"
            aria-label="Main"
          >
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {link.name}
                      <span
                        className={cn(
                          "absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary transition-opacity",
                          isActive ? "opacity-100" : "opacity-0",
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
              <div className="hidden h-9 w-40 animate-pulse rounded-md bg-muted sm:block" />
            ) : session ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 gap-2 rounded-lg border-border bg-card px-2.5 shadow-none hover:bg-accent sm:pl-2 sm:pr-3"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                        {userInitials}
                      </span>
                      <span className="hidden max-w-[140px] truncate text-left text-sm font-medium sm:inline">
                        {session.user.name}
                      </span>
                      <ChevronDown
                        className="hidden size-4 shrink-0 text-muted-foreground sm:block"
                        aria-hidden
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <p className="truncate text-sm font-semibold">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isStaffAdmin((session.user as any).role) && (
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer">
                          <LayoutDashboard size={16} className="mr-2" />
                          Admin dashboard
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {isRecruiter((session.user as any).role) && (
                      <Link href="/recruiter">
                        <DropdownMenuItem className="cursor-pointer">
                          <LayoutDashboard size={16} className="mr-2" />
                          Recruiter hub
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {isApplicant((session.user as any).role) && (
                      <Link href="/applicant">
                        <DropdownMenuItem className="cursor-pointer">
                          <LayoutDashboard size={16} className="mr-2" />
                          Applicant hub
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-lg border-border font-medium shadow-none"
                  >
                    <Briefcase className="size-4" />
                    Post a job
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-lg px-3 font-medium text-muted-foreground hover:text-foreground"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="h-9 rounded-lg px-4 font-semibold shadow-sm"
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
