"use client";

import { useState } from "react";

import { useGetAllJobs } from "@/hooks/useJob";
import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Edit2, Trash2, ExternalLink } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import CreateJobModal from "@/components/dashboard/CreateJobModal";

export default function ManageJobsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { data: jobResponse, isLoading } = useGetAllJobs({ limit: 50 });
    const jobs = jobResponse?.data || [];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold font-clash text-[#2D2D2D]">Manage Jobs</h1>
                    <p className="text-[#515B6F] font-epilogue">Review and keep track of all job postings.</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#4640DE] hover:bg-[#3b36c0] text-white h-12 px-6 font-bold font-epilogue rounded-none"
                >
                    <Plus className="mr-2" size={18} />
                    Post New Job
                </Button>
            </div>

            <CreateJobModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Filters Bar */}
            <div className="bg-white border border-zinc-100 p-4 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for job titles..."
                        className="w-full pl-12 h-12 bg-zinc-50 border border-zinc-100 focus:outline-none focus:border-[#4640DE] font-epilogue text-sm"
                    />
                </div>
                <Button variant="outline" className="h-12 border-zinc-200">
                    Filters
                </Button>
            </div>

            {/* Jobs Table */}
            <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100">
                                <th className="p-6 font-bold font-clash text-[#2D2D2D] text-sm uppercase tracking-wider">Job Title</th>
                                <th className="p-6 font-bold font-clash text-[#2D2D2D] text-sm uppercase tracking-wider">Category</th>
                                <th className="p-6 font-bold font-clash text-[#2D2D2D] text-sm uppercase tracking-wider">Type</th>
                                <th className="p-6 font-bold font-clash text-[#2D2D2D] text-sm uppercase tracking-wider">Status</th>
                                <th className="p-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="p-6"><div className="h-8 bg-zinc-50 w-full" /></td>
                                    </tr>
                                ))
                            ) : jobs.length > 0 ? (
                                jobs.map((job: Job) => (
                                    <tr key={job.id} className="hover:bg-zinc-50/50 transition-all font-epilogue">
                                        <td className="p-6">
                                            <div>
                                                <div className="font-bold text-[#2D2D2D]">{job.title}</div>
                                                <div className="text-xs text-[#515B6F] mt-1">{job.location || "Multiple Locations"}</div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-[#515B6F] text-sm font-medium">{job.category?.title}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-xs font-bold text-[#4640DE] bg-indigo-50 px-3 py-1 uppercase tracking-tighter">
                                                {job.jobType}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-sm font-bold text-[#2D2D2D]">Active</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-zinc-100 rounded-none">
                                                        <MoreHorizontal size={20} className="text-[#515B6F]" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none border-zinc-100 shadow-xl">
                                                    <DropdownMenuItem className="p-3 font-bold font-epilogue gap-3 text-[#515B6F] cursor-pointer">
                                                        <Edit2 size={16} /> Edit Job
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 font-bold font-epilogue gap-3 text-[#515B6F] cursor-pointer">
                                                        <ExternalLink size={16} /> View Listing
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 font-bold font-epilogue gap-3 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                        <Trash2 size={16} /> Delete Job
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-[#515B6F] font-epilogue">
                                        No jobs found. Start by creating a new job posting.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
