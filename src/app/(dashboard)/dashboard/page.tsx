"use client";

import { useState } from "react";

import {
  Building2,
  Briefcase,
  Users,
  LayoutGrid,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetAllJobs } from "@/hooks/useJob";
import { useGetAllCategories } from "@/hooks/useCategory";
import CreateJobModal from "@/components/dashboard/CreateJobModal";
import CreateCategoryModal from "@/components/dashboard/CreateCategoryModal";

export default function AdminPage() {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  // Fetch Jobs for Total Count and Recent Postings
  const { data: jobResponse, isLoading: jobsLoading } = useGetAllJobs({
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch Categories for Total Count
  const { data: categoryResponse, isLoading: categoriesLoading } =
    useGetAllCategories();

  const totalJobs = jobResponse?.meta?.total || 0;
  const recentJobs = jobResponse?.data || [];
  const totalCategories = categoryResponse?.length || 0;

  const isLoading = jobsLoading || categoriesLoading;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-clash text-[#2D2D2D]">
            Dashboard
          </h1>
          <p className="text-[#515B6F] font-epilogue">
            Overview of your application activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsJobModalOpen(true)}
            className="bg-[#4640DE] hover:bg-[#3b36c0] text-white h-12 px-6 font-bold font-epilogue rounded-none shadow-lg shadow-[#4640DE]/20"
          >
            <Plus className="mr-2" size={18} />
            Post New Job
          </Button>
        </div>
      </div>

      <CreateJobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
      />

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Jobs",
            value: isLoading ? "..." : totalJobs.toString(),
            icon: Briefcase,
            color: "bg-blue-50 text-blue-600",
            link: "/dashboard/jobs",
          },
          {
            label: "Total Categories",
            value: isLoading ? "..." : totalCategories.toString(),
            icon: LayoutGrid,
            color: "bg-orange-50 text-orange-600",
            link: "/dashboard/categories",
          },
          {
            label: "Total Users",
            value: "1,240",
            icon: Users,
            color: "bg-emerald-50 text-emerald-600",
            link: "/dashboard/users",
          }, // Static for now as per API availability
          {
            label: "Companies",
            value: "42",
            icon: Building2,
            color: "bg-indigo-50 text-indigo-600",
            link: "/companies",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 border border-zinc-100 shadow-sm transition-all hover:shadow-md group rounded-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <Link
                href={stat.link}
                className="text-[#515B6F] hover:text-[#4640DE] cursor-pointer"
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold font-clash text-[#2D2D2D]">
                {stat.value}
              </h3>
              <p className="text-[#515B6F] font-epilogue text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-zinc-100 p-8 shadow-sm rounded-lg">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-clash text-[#2D2D2D]">
              Recent Job Postings
            </h2>
            <Link
              href="/dashboard/jobs"
              className="text-[#4640DE] font-bold text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-zinc-50 animate-pulse border border-zinc-100"
                />
              ))
            ) : recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border border-zinc-50 hover:bg-zinc-50/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4640DE]/5 rounded-none flex items-center justify-center font-bold text-[#4640DE] font-clash">
                      {job.companyName
                        ? job.companyName.charAt(0)
                        : job.title.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold font-epilogue text-[#2D2D2D]">
                        {job.title}
                      </h4>
                      <p className="text-xs text-[#515B6F] font-medium">
                        {job.category?.title} • {job.location || "Remote"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                      {job.employmentType?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-zinc-400 font-epilogue">
                No recent job postings found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-zinc-100 p-8 shadow-sm rounded-lg">
          <h2 className="text-xl font-bold font-clash text-[#2D2D2D] mb-8">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Button
              onClick={() => setIsCategoryModalOpen(true)}
              variant="outline"
              className="w-full h-14 justify-start text-[#515B6F] hover:text-[#4640DE] hover:border-[#4640DE] border-zinc-100 rounded-none font-bold"
            >
              <LayoutGrid className="mr-3" size={18} />
              Add New Category
            </Button>
            <Link href="/dashboard/categories">
              <Button
                variant="outline"
                className="w-full h-14 justify-start text-[#515B6F] hover:text-[#4640DE] hover:border-[#4640DE] border-zinc-100 rounded-none font-bold"
              >
                <LayoutGrid className="mr-3" size={18} />
                Manage Categories
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button
                variant="outline"
                className="w-full h-14 justify-start text-[#515B6F] hover:text-[#4640DE] hover:border-[#4640DE] border-zinc-100 rounded-none font-bold"
              >
                <Users className="mr-3" size={18} />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                variant="outline"
                className="w-full h-14 justify-start text-[#515B6F] hover:text-red-500 hover:border-red-200 border-zinc-100 rounded-none font-bold opacity-50"
              >
                System Logs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
