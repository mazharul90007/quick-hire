"use client";

import Link from "next/link";
import Image from "next/image";
import { X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 lg:hidden",
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Menu Content */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[70] p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/assets/images/brand-logo.svg"
                            alt="QuickHire"
                            width={28}
                            height={28}
                        />
                        <span className="font-bold text-zinc-900 font-clash text-xl">
                            QuickHire
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full hover:bg-zinc-100"
                    >
                        <X size={24} />
                    </Button>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-1 mb-8">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center p-3 rounded-xl font-medium transition-all font-display",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600"
                                )}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="border-t border-zinc-100 pt-6 flex flex-col gap-4">
                    {/* Dynamic auth section for mobile */}
                    {session ? (
                        <div className="space-y-3">
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <p className="text-sm font-bold text-zinc-900 font-display">
                                    {session.user.name}
                                </p>
                                <p className="text-xs text-zinc-500 truncate font-display">
                                    {session.user.email}
                                </p>
                            </div>
                            <Button
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                                variant="outline"
                                className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl py-6 font-bold font-display flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link href="/login" onClick={onClose}>
                                <Button
                                    variant="outline"
                                    className="w-full border-zinc-200 text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl py-6 font-bold font-display"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup" onClick={onClose}>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-6 font-bold font-display shadow-lg shadow-indigo-500/20">
                                    <User size={18} />
                                    Sign Up
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
