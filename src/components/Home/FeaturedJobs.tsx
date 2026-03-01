"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Heading from "../shared/Heading";
import { useGetFeaturedJobs } from "@/hooks/useJob";
import JobCard from "./JobCard";
import { Job } from "@/types";

const FeaturedJobs = () => {
  const { data: jobs, isLoading, error } = useGetFeaturedJobs();

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="h-12 w-64 bg-zinc-100 animate-pulse rounded-lg" />
            <div className="h-6 w-32 bg-zinc-100 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-zinc-100 animate-pulse border border-zinc-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-red-500">
            Failed to load featured jobs. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  if (!jobs?.length) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-gray-500">
            No featured jobs available at the moment.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <Heading first={"Featured"} second={"jobs"} />
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-[#4640DE] font-bold font-epilogue hover:gap-3 transition-all"
          >
            Show all jobs
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="flex overflow-x-auto pb-6 gap-6 scroll-smooth snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-8 lg:pb-0 hide-scrollbar items-stretch">
          {jobs.map((job: Job) => (
            <div
              key={job.id}
              className="min-w-75 shrink-0 snap-center lg:min-w-0 h-full"
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
