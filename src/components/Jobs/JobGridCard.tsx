"use client";

import { Job } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobGridCardProps {
    job: Job;
}

const JobGridCard = ({ job }: JobGridCardProps) => {
    const logoSrc = job.companyLogo || "/assets/images/no-image.svg";

    return (
        <div className="bg-white border border-zinc-100 p-6 flex flex-col gap-6 hover:border-[#4640DE] hover:shadow-xl transition-all group font-epilogue h-full">
            {/* Top Header: Logo and Job Type */}
            <div className="flex justify-between items-start">
                <div className="w-16 h-16 relative shrink-0 bg-white rounded-xl border border-zinc-50 p-2 group-hover:border-[#4640DE]/20 transition-all">
                    <Image
                        src={logoSrc}
                        alt={job.companyName || "Company logo"}
                        fill
                        className="object-contain p-1 rounded-lg"
                    />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 text-[10px] font-bold font-epilogue uppercase tracking-wider border border-[#4640DE] text-[#4640DE] bg-[#4640DE]/5">
                        {job.employmentType?.replace("_", " ")}
                    </span>
                </div>
            </div>

            {/* Title and Company */}
            <div className="space-y-2">
                <h3 className="text-xl font-bold font-clash text-[#2D2D2D] line-clamp-1 group-hover:text-[#4640DE] transition-colors leading-tight">
                    {job.title}
                </h3>
                <p className="text-[#515B6F] text-sm font-medium flex items-center gap-2">
                    <span className="truncate">{job.companyName}</span>
                    <span className="text-zinc-300">•</span>
                    <span className="flex items-center gap-1 shrink-0">
                        <MapPin size={14} className="text-[#4640DE]" />
                        {job.district}
                    </span>
                </p>
            </div>

            {/* Info Badges */}
            <div className="flex flex-wrap gap-3">
                {job.salary && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D2D2D] bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
                        <DollarSign size={12} className="text-[#4640DE]" />
                        {job.salary}
                    </div>
                )}
                {job.experience && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D2D2D] bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
                        <Briefcase size={12} className="text-[#4640DE]" />
                        {job.experience}
                    </div>
                )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {job.tags?.slice(0, 2).map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 text-[11px] font-bold font-epilogue rounded-full bg-[#4640DE]/5 text-[#4640DE] border border-[#4640DE]/10 uppercase tracking-tight"
                    >
                        {tag}
                    </span>
                ))}
                {job.tags && job.tags.length > 2 && (
                    <span className="px-3 py-1 text-[11px] font-bold font-epilogue rounded-full bg-zinc-50 text-zinc-400 border border-zinc-100 uppercase">
                        +{job.tags.length - 2}
                    </span>
                )}
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-3">
                <div className="h-px bg-zinc-100 w-full" />
                <div className="flex items-center justify-between gap-4">
                    <Link href={`/jobs/${job.id}`} className="grow">
                        <Button className="w-full bg-[#4640DE] hover:bg-[#3b36c0] text-white font-bold font-epilogue py-5 rounded-none shadow-lg shadow-[#4640DE]/20">
                            Apply Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobGridCard;
