"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllJobs, useSmartSearch } from "@/hooks/useJob";
import { useGetIndustries } from "@/hooks/useIndustry";
import JobSearchHeader from "@/components/Jobs/JobSearchHeader";
import JobFilterSidebar from "@/components/Jobs/JobFilterSidebar";
import JobListItem from "@/components/Jobs/JobListItem";
import JobGridCard from "@/components/Jobs/JobGridCard";
import AiSearchResponse from "@/components/Jobs/AiSearchResponse";
import { JobFilters, Job } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const JobsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<JobFilters>({
    searchTerm: searchParams.get("searchTerm") || "",
    industryId: searchParams.get("industryId") || "",
    subIndustryId: searchParams.get("subIndustryId") || "",
    jobType: searchParams.get("jobType") || "",
    employmentType: searchParams.get("employmentType") || "",
    location: searchParams.get("location") || "",
    district: searchParams.get("district") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
  });

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isAiMode, setIsAiMode] = useState(false);

  const { data: jobResponse, isLoading: isStandardLoading } = useGetAllJobs(filters, { enabled: !isAiMode });
  const { data: aiResponse, isLoading: isAiLoading } = useSmartSearch(filters.searchTerm || "", { enabled: isAiMode && !!filters.searchTerm });
  const { data: industries = [] } = useGetIndustries();

  const isLoading = isAiMode ? isAiLoading : isStandardLoading;

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.industryId) params.set("industryId", filters.industryId);
    if (filters.subIndustryId)
      params.set("subIndustryId", filters.subIndustryId);
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (filters.employmentType)
      params.set("employmentType", filters.employmentType);
    if (filters.location) params.set("location", filters.location);
    if (filters.district) params.set("district", filters.district);
    if (filters.page && filters.page > 1)
      params.set("page", filters.page.toString());

    router.replace(`/jobs?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const handleSearch = (searchTerm: string, district: string, aiModeSelected: boolean) => {
    setIsAiMode(aiModeSelected);
    setFilters((prev) => ({ ...prev, searchTerm, district, page: 1 }));
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

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      industryId: "",
      subIndustryId: "",
      jobType: "",
      employmentType: "",
      location: "",
      district: "",
      page: 1,
      limit: 10,
    });
  };

  const isAnyFilterActive = !!(
    filters.searchTerm ||
    filters.industryId ||
    filters.subIndustryId ||
    filters.jobType ||
    filters.employmentType ||
    filters.location ||
    filters.district
  );

  const jobs = isAiMode ? (aiResponse?.jobs || []) : (jobResponse?.data || []);
  const meta = isAiMode ? null : jobResponse?.meta;
  const totalResults = meta?.total || (isAiMode ? jobs.length : 0);
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  const startResult = meta ? (meta.page - 1) * meta.limit + 1 : (jobs.length > 0 ? 1 : 0);
  const endResult = meta ? Math.min(meta.page * meta.limit, meta.total) : jobs.length;

  const industrySelection =
    filters.industryId?.split(",").filter(Boolean) || [];
  const subSelection =
    filters.subIndustryId?.split(",").filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FC] to-white pt-20 pb-20">
      <JobSearchHeader
        onSearch={handleSearch}
        initialSearchTerm={filters.searchTerm}
        initialDistrict={filters.district}
      />

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <JobFilterSidebar
              industries={industries}
              selectedIndustryIds={industrySelection}
              selectedSubIndustryIds={subSelection}
              selectedJobTypes={
                filters.jobType?.split(",").filter(Boolean) || []
              }
              selectedEmploymentTypes={
                filters.employmentType?.split(",").filter(Boolean) || []
              }
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isAnyFilterActive={isAnyFilterActive}
            />
          </aside>

          <div className="lg:hidden flex items-center justify-between mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 font-display border-zinc-200 shadow-sm"
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
                  industries={industries}
                  selectedIndustryIds={industrySelection}
                  selectedSubIndustryIds={subSelection}
                  selectedJobTypes={
                    filters.jobType?.split(",").filter(Boolean) || []
                  }
                  selectedEmploymentTypes={
                    filters.employmentType?.split(",").filter(Boolean) || []
                  }
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isAnyFilterActive={isAnyFilterActive}
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

          <main className="grow space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold font-clash text-[#2D2D2D]">
                  All jobs
                </h2>
                <p className="text-[#515B6F] font-epilogue">
                  Showing {startResult}-{endResult} of {totalResults} results
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-zinc-100 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-md" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white shadow-md" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
            
            {isAiMode && aiResponse?.aiMessage && (
               <AiSearchResponse message={aiResponse.aiMessage} />
            )}

            {isLoading ? (
              isAiMode ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-8 bg-white/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-primary/20 animate-in fade-in zoom-in duration-500 shadow-xl shadow-primary/5">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin shadow-lg shadow-primary/20" />
                    <Sparkles 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" 
                      size={40} 
                    />
                  </div>
                  <div className="text-center space-y-3 max-w-md px-6">
                    <h3 className="text-2xl font-bold font-clash text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      AI is finding your dream job...
                    </h3>
                    <p className="text-muted-foreground font-epilogue leading-relaxed">
                      Our AI is currently analyzing all available positions to find the <span className="font-bold text-primary">perfect match</span> for your profile. Please wait a moment.
                    </p>
                    <div className="flex justify-center gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-40 bg-zinc-50 animate-pulse rounded-xl border border-zinc-100"
                    />
                  ))}
                </div>
              )
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
              <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl bg-white/80">
                <div className="max-w-xs mx-auto space-y-4">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                    <Search size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-clash text-[#2D2D2D]">
                    No jobs found
                  </h3>
                  <p className="text-[#515B6F] font-epilogue">
                    Try different industries or work arrangements, or broaden
                    your search.
                  </p>
                  <Button
                    variant="link"
                    className="text-primary font-bold"
                    onClick={handleClearFilters}
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}

            {totalPages > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-zinc-100">
                <div className="text-[#515B6F] font-epilogue text-sm order-2 sm:order-1">
                  Page {meta?.page} of {totalPages}
                </div>

                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-zinc-200"
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
                          className={`w-10 h-10 rounded-xl font-bold font-epilogue ${
                            filters.page === pageNum
                              ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                              : "border-zinc-200 text-muted-foreground hover:text-primary"
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
                    className="rounded-xl border-zinc-200"
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
};

export default JobsPage;
