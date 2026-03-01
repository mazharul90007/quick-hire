"use client";

import { useState, useEffect } from "react";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logout handler
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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Find Jobs", href: "/jobs" },
    { name: "Browse Companies", href: "/companies" },
  ];

  // if (session) {
  //   navLinks.push({ name: "Dashboard", href: "/dashboard" });
  // }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-transparent py-4 sm:py-3",
        // Scrolled or Mobile menu open state: White background with shadow/blur
        isScrolled || isMobileMenuOpen ? " backdrop-blur-md shadow-md" : "",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/assets/images/brand-logo.svg"
                alt="QuickHire"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-[#2D2D2D] font-clash">
                QuickHire
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors relative py-1 font-display",
                      isActive
                        ? "text-indigo-600 font-bold"
                        : "text-[#515B6F] hover:text-indigo-600",
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-in fade-in zoom-in duration-300" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Action Icons / Auth Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {isPending ? (
              <div className="h-10 w-24 bg-zinc-100 animate-pulse rounded-xl" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-xs font-bold text-zinc-900 font-display">
                    {session.user.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium font-display">
                    {session.user.email}
                  </span>
                </div>
                {(session.user as any).role === "ADMIN" && (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold text-[#4640DE] border-indigo-100 hover:bg-indigo-50 font-epilogue h-9 rounded-none mr-2 hidden md:flex"
                    >
                      <LayoutDashboard size={14} className="mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-xl hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 font-display px-4"
                  >
                    Login
                  </Button>
                </Link>
                <div className="bg-zinc-200" />
                <Link href="/signup">
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 font-bold font-display shadow-lg shadow-indigo-500/20 rounded-none">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Toggle - Placed on the right */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl cursor-pointer text-zinc-600 hover:bg-zinc-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
        session={session}
        onLogout={handleLogout}
        pathname={pathname}
      />
    </nav>
  );
};

export default Navbar;
