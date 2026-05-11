"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Heading from "../shared/Heading";
import { useGetIndustries } from "@/hooks/useIndustry";

const CategorySection = () => {
  const { data: industries = [], isLoading } = useGetIndustries();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="h-12 w-64 bg-zinc-100 animate-pulse rounded-lg" />
            <div className="h-6 w-32 bg-zinc-100 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-52 bg-zinc-100 animate-pulse rounded-2xl border border-zinc-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
          <div>
            <Heading first={"Explore by"} second={"industry"} />
            <p className="mt-3 text-muted-foreground font-epilogue max-w-lg">
              Pick a sector to see roles that match your background. Filters
              sync with the job board.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-primary font-bold font-epilogue hover:gap-3 transition-all shrink-0"
          >
            Browse all jobs
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {industries.map((industry) => {
            const jobCount = industry._count?.jobs ?? 0;
            const logoSrc = industry.logo || "/assets/images/no-image.svg";
            return (
              <Link
                key={industry.id}
                href={`/jobs?industryId=${industry.id}`}
                className={cn(
                  "group relative isolate overflow-hidden rounded-2xl border border-border/60",
                  "bg-linear-to-b from-card to-muted/10 p-6 shadow-sm transition-all duration-300",
                  "hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10",
                )}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/8 blur-2xl transition-opacity group-hover:opacity-90"
                  aria-hidden
                />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
                      <img
                        src={logoSrc}
                        alt={industry.name}
                        className="h-10 w-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/images/no-image.svg";
                        }}
                      />
                    </div>
                    <span className="inline-flex items-center rounded-md border border-border/50 bg-card px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      {jobCount} {jobCount === 1 ? "job" : "jobs"}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    <h3 className="font-clash text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {industry.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground font-epilogue">
                      Explore open positions and specializations in this
                      industry.
                    </p>
                  </div>

                  <div className="mt-auto pt-5">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      View opportunities
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </div>
                </div>
                <div className="sr-only">
                  {industry.name} industry with {jobCount}{" "}
                  {jobCount === 1 ? "job" : "jobs"} available
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
