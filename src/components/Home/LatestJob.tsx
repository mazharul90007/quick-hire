"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Heading from "../shared/Heading";
import { useGetLatestJobs } from "@/hooks/useJob";
import LatestJobCard from "./LatestJobCard";
import { Job } from "@/types";

const LatestJobs = () => {
  const { data: jobs, isLoading } = useGetLatestJobs();

  if (isLoading) {
    return (
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div className="h-12 w-64 bg-zinc-100 animate-pulse rounded-lg" />
            <div className="h-6 w-32 bg-zinc-100 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-zinc-100 animate-pulse border border-zinc-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden bg-[#F8F8FD]">
      {/* Background Pattern */}
      <div
        className="absolute top-0 right-0 w-full h-full opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/assets/images/Pattern.svg")',
          backgroundPosition: "top right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <Heading first={"Latest"} second={"jobs open"} />
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-[#4640DE] font-bold font-epilogue hover:gap-3 transition-all"
          >
            Show all jobs
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs?.map((job: Job) => (
            <LatestJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
