"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft, Building2, Rocket } from "lucide-react";

export default function CompaniesPage() {
    return (
        <div
            className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-zinc-50 py-20 px-4 bg-repeat bg-center"
            style={{ backgroundImage: "url('/assets/images/Pattern.svg')" }}
        >
            <div className="max-w-2xl w-full text-center space-y-8 bg-white/80 backdrop-blur-sm border border-zinc-100 p-12 md:p-20 shadow-2xl rounded-none relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4640DE]/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />

                <div className="relative space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-50 rounded-full mb-4 group">
                        <Construction size={48} className="text-[#4640DE] group-hover:rotate-12 transition-transform duration-300" />
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-5xl md:text-6xl font-bold font-clash text-[#2D2D2D] tracking-tight">
                            Companies
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-[#4640DE] font-bold font-epilogue uppercase tracking-widest text-sm">
                            <span className="w-8 h-[2px] bg-[#4640DE]" />
                            Under Construction
                            <span className="w-8 h-[2px] bg-[#4640DE]" />
                        </div>
                    </div>

                    <p className="text-[#515B6F] font-epilogue text-lg max-w-md mx-auto leading-relaxed">
                        We're currently building a premium directory of top-tier companies. Soon you'll be able to explore detailed company profiles, cultures, and exclusive career opportunities.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/">
                            <Button className="bg-[#4640DE] hover:bg-[#3b36c0] text-white px-8 h-14 font-bold font-epilogue rounded-none shadow-lg shadow-[#4640DE]/20 group">
                                <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                                Back to Home
                            </Button>
                        </Link>
                        <Link href="/jobs">
                            <Button variant="outline" className="border-zinc-200 text-[#2D2D2D] hover:bg-zinc-50 px-8 h-14 font-bold font-epilogue rounded-none">
                                <Building2 className="mr-2 text-[#4640DE]" size={20} />
                                Find Jobs Instead
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-12 grid grid-cols-2 lg:grid-cols-3 gap-6 border-t border-zinc-100 mt-12 opacity-50">
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-[#2D2D2D] font-bold font-clash text-2xl">500+</div>
                            <div className="text-[#515B6F] text-xs font-bold uppercase tracking-wider">Top Companies</div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-[#2D2D2D] font-bold font-clash text-2xl">Coming</div>
                            <div className="text-[#515B6F] text-xs font-bold uppercase tracking-wider">Very Soon</div>
                        </div>
                        <div className="hidden lg:flex flex-col items-center gap-2">
                            <Rocket size={24} className="text-[#4640DE] mb-1" />
                            <div className="text-[#515B6F] text-xs font-bold uppercase tracking-wider">Stay Tuned</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
