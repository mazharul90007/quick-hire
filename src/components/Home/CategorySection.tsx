"use client";

import {
  ArrowRight,
  PenTool,
  BarChart3,
  Megaphone,
  Briefcase,
  Monitor,
  Code2,
  Layout,
  Users,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Heading from "../shared/Heading";
import { useGetAllCategories } from "@/hooks/useCategory";

interface Category {
  id: string;
  title: string;
  jobs: any[];
}

const iconMap: Record<string, any> = {
  Design: PenTool,
  Sales: BarChart3,
  Marketing: Megaphone,
  Finance: Layout,
  Technology: Monitor,
  Engineering: Code2,
  Business: Briefcase,
  "Human Resource": Users,
};

const CategorySection = () => {
  const { data: categories, isLoading } = useGetAllCategories();

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="h-12 w-64 bg-zinc-100 animate-pulse rounded-lg" />
            <div className="h-6 w-32 bg-zinc-100 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-zinc-100 animate-pulse rounded-none border border-zinc-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <Heading first={"Explore by"} second={"category"} />
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-[#26A4FF] font-bold font-epilogue hover:gap-3 transition-all"
          >
            Show all jobs
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => {
            const Icon = iconMap[category.title] || Layout;
            return (
              <Link
                key={category.id}
                href={`/jobs?categoryId=${category.id}`}
                className={cn(
                  "group p-8 border border-zinc-200 transition-all duration-300",
                  "hover:bg-[#4640DE] hover:border-[#4640DE] hover:shadow-xl hover:shadow-indigo-200",
                )}
              >
                <div className="flex flex-row md:flex-col h-full items-center md:items-start md:justify-between gap-6">
                  <div className="">
                    <Icon
                      size={40}
                      className="text-[#4640DE] group-hover:text-white transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2 items-start justify-between w-full">
                    <h3 className="text-2xl font-semibold font-clash text-[#2D2D2D] group-hover:text-white transition-colors">
                      {category.title}
                    </h3>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[#848a99] group-hover:text-indigo-100 font-epilogue transition-colors">
                        {category.jobs?.length || 0} jobs available
                      </p>
                      <ArrowRight
                        size={20}
                        className="text-[#2D2D2D] group-hover:text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
