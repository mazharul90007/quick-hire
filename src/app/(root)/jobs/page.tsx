"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllJobs } from "@/hooks/useJob";
import { useGetAllCategories } from "@/hooks/useCategory";
import JobSearchHeader from "@/components/Jobs/JobSearchHeader";
import JobFilterSidebar from "@/components/Jobs/JobFilterSidebar";
import JobListItem from "@/components/Jobs/JobListItem";
import JobGridCard from "@/components/Jobs/JobGridCard";
import { JobFilters, Job } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Suspense } from "react";

const JobsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filters derived from URL
  const [filters, setFilters] = useState<JobFilters>({
    searchTerm: searchParams.get("searchTerm") || "",
    categoryId: searchParams.get("categoryId") || "",
    jobType: searchParams.get("jobType") || "",
    employmentType: searchParams.get("employmentType") || "",
    location: searchParams.get("location") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
  });

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Fetch data
  const { data: jobResponse, isLoading } = useGetAllJobs(filters);
  const { data: categories } = useGetAllCategories();

  // Sync state with URL changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (filters.employmentType)
      params.set("employmentType", filters.employmentType);
    if (filters.location) params.set("location", filters.location);
    if (filters.page && filters.page > 1)
      params.set("page", filters.page.toString());

    router.replace(`/jobs?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const handleSearch = (searchTerm: string, location: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, location, page: 1 }));
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => {
      const currentValues =
        (prev[type as keyof JobFilters] as string)
          ?.split(",")
          .filter(Boolean) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return { ...prev, [type]: newValues.join(","), page: 1 };
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const jobs = jobResponse?.data || [];
  const meta = jobResponse?.meta;
  const totalResults = meta?.total || 0;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  // Calculate showing range
  const startResult = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const endResult = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <JobSearchHeader
        onSearch={handleSearch}
        initialSearchTerm={filters.searchTerm}
        initialLocation={filters.location}
      />

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <JobFilterSidebar
              categories={categories || []}
              selectedCategories={
                filters.categoryId?.split(",").filter(Boolean) || []
              }
              selectedJobTypes={
                filters.jobType?.split(",").filter(Boolean) || []
              }
              selectedEmploymentTypes={
                filters.employmentType?.split(",").filter(Boolean) || []
              }
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 font-display"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] overflow-y-auto"
              >
                <JobFilterSidebar
                  categories={categories || []}
                  selectedCategories={
                    filters.categoryId?.split(",").filter(Boolean) || []
                  }
                  selectedJobTypes={
                    filters.jobType?.split(",").filter(Boolean) || []
                  }
                  selectedEmploymentTypes={
                    filters.employmentType?.split(",").filter(Boolean) || []
                  }
                  onFilterChange={handleFilterChange}
                />
              </SheetContent>
            </Sheet>

            <p className="text-[#515B6F] font-epilogue text-sm">
              Showing{" "}
              <span className="text-[#2D2D2D] font-bold">
                {startResult}-{endResult}
              </span>{" "}
              of{" "}
              <span className="text-[#2D2D2D] font-bold">{totalResults}</span>{" "}
              results
            </p>
          </div>

          {/* Main Results Area */}
          <main className="grow space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold font-clash text-[#2D2D2D]">
                  All Jobs
                </h2>
                <p className="text-[#515B6F] font-epilogue">
                  Showing {startResult}-{endResult} of {totalResults} results
                </p>
              </div>

              <div className="flex items-center gap-4 bg-zinc-50 p-1.5 rounded-lg border border-zinc-100">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-[#4640DE] shadow-sm" : "text-zinc-400"}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#4640DE] shadow-sm" : "text-zinc-400"}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-zinc-50 animate-pulse border border-zinc-100"
                  />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
              >
                {jobs.map((job: Job) =>
                  viewMode === "grid" ? (
                    <JobGridCard key={job.id} job={job} />
                  ) : (
                    <JobListItem key={job.id} job={job} />
                  ),
                )}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-zinc-100 rounded-none bg-zinc-50/30">
                <div className="max-w-xs mx-auto space-y-4">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                    <Search size={32} className="text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-bold font-clash text-[#2D2D2D]">
                    No jobs found
                  </h3>
                  <p className="text-[#515B6F] font-epilogue">
                    We could not find any jobs matching your current filters.
                    Try adjusting them or search for something else.
                  </p>
                  <Button
                    variant="link"
                    className="text-[#4640DE] font-bold"
                    onClick={() => setFilters({ page: 1, limit: 10 })}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-zinc-100">
                <div className="text-[#515B6F] font-epilogue text-sm order-2 sm:order-1">
                  Showing page {meta?.page} of {totalPages}
                </div>

                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-none border-zinc-200"
                    disabled={filters.page === 1 || isLoading}
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                  >
                    <ChevronLeft size={20} />
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            filters.page === pageNum ? "default" : "outline"
                          }
                          className={`w-10 h-10 rounded-none font-bold font-epilogue ${
                            filters.page === pageNum
                              ? "bg-[#4640DE] hover:bg-[#3b36c0] text-white shadow-lg shadow-[#4640DE]/20"
                              : "border-zinc-200 text-[#515B6F] hover:text-[#4640DE]"
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isLoading}
                        >
                          {pageNum}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-none border-zinc-200"
                    disabled={filters.page === totalPages || isLoading}
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const JobsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
};

export default JobsPage;
