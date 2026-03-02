/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Menu, LogOut, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { authClient } from "@/lib/auth-client";
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

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-transparent py-4 sm:py-3",
          isScrolled ? "backdrop-blur-md shadow-md bg-white/80" : "",
          isMobileMenuOpen ? "bg-white" : "",
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
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
                  {/* Desktop User Dropdown */}
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-green-50 text-zinc-600 transition-colors h-10 w-10 cursor-pointer hover:text-green-600 border shadow"
                        >
                          <User size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 mt-2 p-2 rounded-xl shadow-xl border-zinc-100"
                      >
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-bold leading-none text-zinc-900 font-display">
                              {session.user.name}
                            </p>
                            <p className="text-xs leading-none text-zinc-500 font-display">
                              {session.user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-2 bg-zinc-100" />
                        {(session.user as any).role === "ADMIN" && (
                          <Link href="/dashboard">
                            <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-indigo-50 focus:text-indigo-600 font-display py-2.5">
                              <LayoutDashboard size={16} className="mr-2" />
                              <span>Dashboard</span>
                            </DropdownMenuItem>
                          </Link>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors h-10 w-10 cursor-pointer border"
                    title="Logout"
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
      </nav>

      {/* Mobile Menu Overlay - Outside nav to avoid inherited blur */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
        session={session}
        onLogout={handleLogout}
        pathname={pathname}
      />
    </>
  );
};

export default Navbar;
