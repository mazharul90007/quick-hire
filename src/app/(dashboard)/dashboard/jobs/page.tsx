"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllJobs, useUpdateJob } from "@/hooks/useJob";
import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  ExternalLink,
  Briefcase,
  LayoutGrid,
  List,
  Zap,
  PencilLine,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  jobCompanyLogo,
  jobCompanyName,
  formatJobType,
  formatEmploymentType,
} from "@/lib/job-display";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import UpdateJobModal from "@/components/dashboard/UpdateJobModal";

function relativePosted(createdAt: string): string {
  const d = new Date(createdAt);
  const ms = Date.now() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function plainDescription(text: string | null | undefined, max = 140): string {
  if (!text?.trim()) return "No description has been added for this role yet.";
  const t = text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function jobTags(job: Job): string[] {
  const raw = [...(job.requiredSkills ?? []), ...(job.tags ?? [])]
    .map((x) => String(x).trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of raw) {
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
    if (out.length >= 4) break;
  }
  return out;
}

function locationLine(job: Job): string {
  const parts = [job.location, job.district].filter(Boolean);
  if (parts.length) return parts.join(", ");
  if (job.recruiter?.companyAddress) return job.recruiter.companyAddress;
  if (job.jobType === "REMOTE") return "Remote";
  return "Location not specified";
}

type SortKey = "newest" | "title_asc" | "title_desc";

const LIMIT_OPTIONS = [8, 12, 16, 24] as const;

function JobCardBody({ job }: { job: Job }) {
  const company = jobCompanyName(job);
  const logoSrc = jobCompanyLogo(job);
  const tags = jobTags(job);
  const employment =
    formatEmploymentType(job.employmentType) || formatJobType(job.jobType);

  return (
    <>
      <div
        className="pointer-events-none flex gap-3"
        data-slot="job-card-body"
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50">
          <Image
            src={logoSrc}
            alt={company}
            fill
            className="object-contain p-1.5"
            sizes="48px"
            unoptimized={
              logoSrc.startsWith("http") || logoSrc.startsWith("//")
            }
          />
        </div>
        <div className="min-w-0 flex-1 pr-8">
          <p className="truncate font-epilogue text-sm font-bold text-zinc-900">
            {company}
          </p>
          <p className="mt-0.5 truncate font-epilogue text-xs text-zinc-500">
            {locationLine(job)}
          </p>
        </div>
      </div>

      <div className="pointer-events-auto absolute top-4 right-12 z-20 flex items-center gap-1.5">
        {job.isVerified ? (
          <BadgeCheck
            className="h-5 w-5 text-sky-600"
            aria-label="Verified"
          />
        ) : (
          <ShieldAlert
            className="h-5 w-5 text-red-500"
            aria-label="Unverified"
          />
        )}
        {job.featured ? (
          <Zap
            className="h-5 w-5 text-emerald-500"
            aria-label="Featured"
          />
        ) : null}
      </div>

      <div className="pointer-events-none mt-4 min-w-0">
        <h3 className="font-clash text-lg font-bold leading-snug text-zinc-900 line-clamp-2 group-hover:text-[#4640DE]">
          {job.title ?? "Untitled role"}
        </h3>
        <p className="mt-1.5 font-epilogue text-sm text-zinc-500">
          {employment}{" "}
          <span className="text-zinc-400">·</span>{" "}
          {relativePosted(job.createdAt)}
        </p>
        <p className="mt-3 font-epilogue text-sm leading-relaxed text-zinc-600 line-clamp-3">
          {plainDescription(job.description)}
        </p>
      </div>

      {tags.length > 0 ? (
        <div className="pointer-events-none mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-100 px-2.5 py-1 font-epilogue text-[11px] font-semibold text-zinc-600"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="pointer-events-none mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
        <span className="font-clash text-base font-bold text-[#4640DE]">
          {job.salary?.trim() || "—"}
        </span>
      </div>
    </>
  );
}

export default function ManageJobsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(8);
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editOpen, setEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const updateJob = useUpdateJob();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debounced, limit, sortKey]);

  const { sortBy, sortOrder } = useMemo(() => {
    if (sortKey === "title_asc") return { sortBy: "title", sortOrder: "asc" as const };
    if (sortKey === "title_desc")
      return { sortBy: "title", sortOrder: "desc" as const };
    return { sortBy: "createdAt", sortOrder: "desc" as const };
  }, [sortKey]);

  const params = useMemo(
    () => ({
      allStatuses: true,
      page,
      limit,
      sortBy,
      sortOrder,
      ...(debounced ? { searchTerm: debounced } : {}),
    }),
    [page, limit, sortBy, sortOrder, debounced],
  );

  const { data: jobResponse, isLoading } = useGetAllJobs(params);
  const jobs = jobResponse?.data ?? [];
  const meta = jobResponse?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const quickPatch = async (
    job: Job,
    patch: Partial<Pick<Job, "isVerified" | "featured">>,
    successMsg: string,
  ) => {
    try {
      await updateJob.mutateAsync({ id: job.id, payload: patch });
      toast.success(successMsg);
    } catch (error: unknown) {
      const msg =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String((error.response.data as { message: string }).message)
          : "Failed to update job";
      toast.error(msg);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Listings
          </p>
          <h1 className="font-clash text-4xl font-bold text-zinc-900">All jobs</h1>
          <p className="mt-2 max-w-2xl font-epilogue text-zinc-600">
            Directory of every posting. New jobs are created by recruiters via{" "}
            <Link
              href="/jobs"
              className="font-semibold text-zinc-900 underline-offset-2 hover:underline"
            >
              the product
            </Link>
            .
          </p>
        </div>
        <Button
          asChild
          className="shrink-0 rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/jobs" target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Public job board
          </Link>
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search title, location, description…"
          className="h-12 rounded-xl border-zinc-200 bg-white pl-11 text-zinc-900 placeholder:text-zinc-400"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-epilogue text-sm text-zinc-600">
          {isLoading ? (
            <span className="text-zinc-400">Loading…</span>
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-zinc-900">{page}</span> of{" "}
              <span className="font-semibold text-zinc-900">{totalPages}</span>{" "}
              {totalPages === 1 ? "Page" : "Pages"}
            </>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="font-epilogue text-sm text-zinc-500">Show</span>
            <Select
              value={String(limit)}
              onValueChange={(v) => setLimit(Number(v))}
            >
              <SelectTrigger className="h-9 w-18 rounded-lg border-zinc-200 bg-white font-epilogue text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-200 bg-white">
                {LIMIT_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-epilogue text-sm text-zinc-500">Sort by</span>
            <Select
              value={sortKey}
              onValueChange={(v) => setSortKey(v as SortKey)}
            >
              <SelectTrigger className="h-9 w-42 rounded-lg border-zinc-200 bg-white font-epilogue text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-200 bg-white">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="title_asc">Title (A–Z)</SelectItem>
                <SelectItem value="title_desc">Title (Z–A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex rounded-lg border border-zinc-200 bg-white p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-md",
                view === "list"
                  ? "bg-[#4640DE] text-white hover:bg-[#3b36c0] hover:text-white"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
              )}
              aria-label="List view"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-md",
                view === "grid"
                  ? "bg-[#4640DE] text-white hover:bg-[#3b36c0] hover:text-white"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
              )}
              aria-label="Grid view"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div
          className={cn(
            "gap-4",
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              : "flex flex-col",
          )}
        >
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/80"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-20 text-center font-epilogue text-zinc-500">
          No jobs match your search.
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {jobs.map((job: Job) => (
            <div
              key={job.id}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md",
                job.isVerified
                  ? "border-zinc-200 bg-white"
                  : "border-red-200 bg-red-50/60",
              )}
            >
              <Link
                href={`/jobs/${job.id}`}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 z-0 rounded-2xl"
                aria-label={`Open job: ${job.title ?? "Untitled"}`}
              />
              <div className="absolute top-3 right-3 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border-zinc-200 bg-white text-zinc-900"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingJob(job);
                        setEditOpen(true);
                      }}
                      className="focus:bg-zinc-50"
                    >
                      <PencilLine className="mr-2 h-4 w-4" />
                      Edit job
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-zinc-50">
                      <Link href={`/jobs/${job.id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open listing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="focus:bg-zinc-50"
                      onClick={() =>
                        void quickPatch(
                          job,
                          { isVerified: !(job.isVerified ?? false) },
                          job.isVerified ? "Job unverified" : "Job verified",
                        )
                      }
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      {job.isVerified ? "Mark unverified" : "Verify job"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="focus:bg-zinc-50"
                      onClick={() =>
                        void quickPatch(
                          job,
                          { featured: !(job.featured ?? false) },
                          job.featured
                            ? "Job removed from featured"
                            : "Job marked as featured",
                        )
                      }
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      {job.featured ? "Remove featured" : "Add featured"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-zinc-50">
                      <Link
                        href={`/dashboard/applications?jobId=${job.id}`}
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        Applications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative z-10 flex h-full flex-col">
                <JobCardBody job={job} />
                <div className="mt-auto pt-4 pointer-events-auto">
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link href={`/jobs/${job.id}`} target="_blank" rel="noreferrer">
                      View details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {jobs.map((job: Job) => (
            <li
              key={job.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6",
                job.isVerified
                  ? "border-zinc-200 bg-white"
                  : "border-red-200 bg-red-50/60",
              )}
            >
              <Link
                href={`/jobs/${job.id}`}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 z-0 rounded-2xl"
                aria-label={`Open job: ${job.title ?? "Untitled"}`}
              />
              <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border-zinc-200 bg-white text-zinc-900"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingJob(job);
                        setEditOpen(true);
                      }}
                      className="focus:bg-zinc-50"
                    >
                      <PencilLine className="mr-2 h-4 w-4" />
                      Edit job
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-zinc-50">
                      <Link href={`/jobs/${job.id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open listing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="focus:bg-zinc-50"
                      onClick={() =>
                        void quickPatch(
                          job,
                          { isVerified: !(job.isVerified ?? false) },
                          job.isVerified ? "Job unverified" : "Job verified",
                        )
                      }
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      {job.isVerified ? "Mark unverified" : "Verify job"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="focus:bg-zinc-50"
                      onClick={() =>
                        void quickPatch(
                          job,
                          { featured: !(job.featured ?? false) },
                          job.featured
                            ? "Job removed from featured"
                            : "Job marked as featured",
                        )
                      }
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      {job.featured ? "Remove featured" : "Add featured"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-zinc-50">
                      <Link
                        href={`/dashboard/applications?jobId=${job.id}`}
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        Applications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50">
                    <Image
                      src={jobCompanyLogo(job)}
                      alt={jobCompanyName(job)}
                      fill
                      className="object-contain p-2"
                      sizes="56px"
                      unoptimized={jobCompanyLogo(job).startsWith("http")}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-epilogue text-sm font-bold text-zinc-900">
                          {jobCompanyName(job)}
                        </p>
                        <p className="mt-0.5 font-epilogue text-xs text-zinc-500">
                          {locationLine(job)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {job.isVerified ? (
                          <BadgeCheck
                            className="h-5 w-5 text-sky-600"
                            aria-label="Verified"
                          />
                        ) : (
                          <ShieldAlert
                            className="h-5 w-5 text-red-500"
                            aria-label="Unverified"
                          />
                        )}
                        {job.featured ? (
                          <Zap
                            className="h-5 w-5 text-emerald-500"
                            aria-label="Featured"
                          />
                        ) : null}
                      </div>
                    </div>
                    <h3 className="mt-3 font-clash text-xl font-bold text-zinc-900 group-hover:text-[#4640DE]">
                      {job.title ?? "Untitled role"}
                    </h3>
                    <p className="mt-1 font-epilogue text-sm text-zinc-500">
                      {formatEmploymentType(job.employmentType) ||
                        formatJobType(job.jobType)}{" "}
                      <span className="text-zinc-400">·</span>{" "}
                      {relativePosted(job.createdAt)}
                    </p>
                    <p className="mt-2 max-w-3xl font-epilogue text-sm leading-relaxed text-zinc-600 line-clamp-2">
                      {plainDescription(job.description, 220)}
                    </p>
                    {jobTags(job).length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {jobTags(job).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-zinc-100 px-2.5 py-1 font-epilogue text-[11px] font-semibold text-zinc-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col justify-center border-t border-zinc-100 pt-4 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
                  <span className="font-clash text-lg font-bold whitespace-nowrap text-[#4640DE]">
                    {job.salary?.trim() || "—"}
                  </span>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="mt-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link href={`/jobs/${job.id}`} target="_blank" rel="noreferrer">
                      View details
                    </Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && !isLoading && jobs.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-zinc-200 pt-8">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg border-zinc-200"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-2 font-epilogue text-sm text-zinc-600">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg border-zinc-200"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      ) : null}

      <UpdateJobModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        job={editingJob}
      />
    </div>
  );
}
