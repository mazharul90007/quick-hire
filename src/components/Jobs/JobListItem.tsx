"use client";

import { Job } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobListItemProps {
    job: Job;
}

const JobListItem = ({ job }: JobListItemProps) => {
    const logoSrc = job.companyLogo || "/assets/images/no-image.svg";

    return (
        <div className="bg-white p-6 border border-zinc-100 hover:border-[#4640DE] hover:shadow-xl transition-all group flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="w-16 h-16 relative flex-shrink-0 bg-white rounded-lg p-2 border border-zinc-50 group-hover:border-[#4640DE]/20">
                <Image
                    src={logoSrc}
                    alt={job.companyName || "Company logo"}
                    fill
                    className="object-contain p-1 rounded-md"
                />
            </div>

            <div className="flex flex-col gap-3 grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold font-clash text-[#2D2D2D] group-hover:text-[#4640DE] transition-colors">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[#515B6F] font-epilogue text-sm">
                            <span className="font-semibold text-zinc-900">{job.companyName}</span>
                            <span className="text-zinc-300">•</span>
                            <span className="flex items-center gap-1">
                                <MapPin size={14} className="text-[#4640DE]" />
                                {job.location || job.district}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-4 py-1.5 text-xs font-bold font-epilogue rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {job.jobType?.replace("_", " ")}
                        </span>
                        <span className="px-4 py-1.5 text-xs font-bold font-epilogue rounded-full bg-[#4640DE]/5 text-[#4640DE] border border-[#4640DE]/10 lowercase">
                            {job.employmentType?.replace("_", " ").toLowerCase()}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm font-epilogue text-[#515B6F]">
                    {job.salary && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                                <DollarSign size={14} className="text-[#4640DE]" />
                            </div>
                            <span className="font-medium text-[#2D2D2D]">{job.salary}</span>
                        </div>
                    )}
                    {job.experience && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                                <Briefcase size={14} className="text-[#4640DE]" />
                            </div>
                            <span className="font-medium text-[#2D2D2D] font-epilogue">Experience: {job.experience}</span>
                        </div>
                    )}
                    {job.deadline && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                                <Calendar size={14} className="text-[#4640DE]" />
                            </div>
                            <span className="font-medium text-[#2D2D2D] font-epilogue">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 min-w-[150px]">
                <Link href={`/jobs/${job.id}`}>
                    <Button className="w-full bg-[#4640DE] hover:bg-[#3b36c0] text-white font-bold font-epilogue py-6 rounded-none shadow-lg shadow-[#4640DE]/20">
                        Apply Now
                    </Button>
                </Link>
                <p className="text-xs text-center text-[#515B6F] font-epilogue">
                    Posted on {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
            </div>
        </div>
    );
};

export default JobListItem;
