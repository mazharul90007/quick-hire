"use client";

import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRecruiterProfile } from "@/hooks/useRecruiterProfile";
import { useGetAllJobs } from "@/hooks/useJob";
import { useGetApplications } from "@/hooks/useApplication";
import { AdminStatCard } from "@/components/dashboard/AdminStatCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  ClipboardList,
  Clock,
  ExternalLink,
  MoreVertical,
  Plus,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import type { Job } from "@/types";
import {
  formatEmploymentType,
  formatJobType,
  jobCompanyLogo,
  jobCompanyName,
} from "@/lib/job-display";
import { cn } from "@/lib/utils";

function relativePosted(createdAt: string): string {
  const d = new Date(createdAt);
  const ms = Date.now() - d.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function jobLocationLine(job: Job): string {
  const parts = [job.location, job.district].filter(Boolean);
  if (parts.length) return parts.join(", ");
  if (job.jobType === "REMOTE") return "Remote";
  return "—";
}

export default function RecruiterOverviewPage() {
  const { data: session } = authClient.useSession();
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErr,
  } = useRecruiterProfile();
  const recruiterId = profile?.id;
  const jobsEnabled = !!recruiterId;

  const { data: jobsTotalRes, isLoading: jobsTotalLoading } = useGetAllJobs(
    {
      recruiterId,
      limit: 1,
      page: 1,
      allStatuses: true,
    },
    { enabled: jobsEnabled },
  );
  const { data: jobsLiveRes, isLoading: jobsLiveLoading } = useGetAllJobs(
    {
      recruiterId,
      limit: 1,
      page: 1,
      status: "ACTIVE",
    },
    { enabled: jobsEnabled },
  );
  const { data: jobsPendingRes, isLoading: jobsPendingLoading } = useGetAllJobs(
    {
      recruiterId,
      limit: 1,
      page: 1,
      allStatuses: true,
      isVerified: false,
    },
    { enabled: jobsEnabled },
  );
  const { data: jobsFeaturedRes, isLoading: jobsFeaturedLoading } = useGetAllJobs(
    {
      recruiterId,
      limit: 1,
      page: 1,
      allStatuses: true,
      featured: true,
    },
    { enabled: jobsEnabled },
  );
  const { data: recentJobsRes, isLoading: recentJobsLoading } = useGetAllJobs(
    {
      recruiterId,
      limit: 5,
      page: 1,
      allStatuses: true,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { enabled: jobsEnabled },
  );

  const { data: appsTotalRes, isLoading: appsTotalLoading } =
    useGetApplications({
      limit: 1,
      page: 1,
    });
  const { data: recentAppsRes, isLoading: recentAppsLoading } =
    useGetApplications({
      limit: 8,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const jobTotal = jobsTotalRes?.meta?.total ?? 0;
  const liveTotal = jobsLiveRes?.meta?.total ?? 0;
  const pendingVerifyTotal = jobsPendingRes?.meta?.total ?? 0;
  const featuredTotal = jobsFeaturedRes?.meta?.total ?? 0;
  const appTotal = appsTotalRes?.meta?.total ?? 0;
  const recentJobs = recentJobsRes?.data ?? [];
  const recentApps = recentAppsRes?.data ?? [];

  const company = useMemo(
    () => profile?.companyName || profile?.recruiterName || "your company",
    [profile],
  );

  const welcomeName =
    session?.user?.name?.split(" ")[0] ||
    profile?.recruiterName?.split(" ")[0] ||
    "";

  if (profileError) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50/80 p-8 font-epilogue text-rose-900">
        <p className="font-clash text-lg font-bold">
          Could not load recruiter profile
        </p>
        <p className="mt-2 text-sm text-rose-800">
          {(profileErr as Error)?.message ||
            "Check that you are signed in as a recruiter and the API is running."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-8">
      <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Recruiter hub
          </p>
          <h1 className="font-clash text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            Welcome back
            {welcomeName ? `, ${welcomeName}` : profileLoading ? "…" : ""}
          </h1>
          <p className="mt-3 max-w-xl font-epilogue text-lg text-zinc-600">
            <span className="font-semibold text-zinc-800">{company}</span>
            {" — "}
            Track listings, verification, and applicants in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="rounded-xl px-5 font-bold shadow-lg shadow-primary/25"
          >
            <Link href="/recruiter/jobs">
              <Plus className="h-4 w-4" />
              Post a job
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-zinc-300 bg-white font-bold text-zinc-800 hover:bg-zinc-50"
          >
            <Link href="/recruiter/applications">
              Review applications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="space-y-8">
        <div>
          <h2 className="mb-3 font-clash text-lg font-bold text-zinc-900">
            Your listings
          </h2>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Total jobs"
              value={
                !jobsEnabled || jobsTotalLoading ? "—" : jobTotal
              }
              hint="All statuses you own"
              icon={Briefcase}
              href="/recruiter/jobs"
              accent="indigo"
            />
            <AdminStatCard
              label="Live on board"
              value={!jobsEnabled || jobsLiveLoading ? "—" : liveTotal}
              hint="Active postings"
              icon={TrendingUp}
              href="/recruiter/jobs"
              accent="emerald"
            />
            <AdminStatCard
              label="Pending verification"
              value={
                !jobsEnabled || jobsPendingLoading ? "—" : pendingVerifyTotal
              }
              hint="Awaiting admin approval"
              icon={ShieldAlert}
              href="/recruiter/jobs"
              accent="rose"
            />
            <AdminStatCard
              label="Featured"
              value={
                !jobsEnabled || jobsFeaturedLoading ? "—" : featuredTotal
              }
              hint="Promoted roles"
              icon={Sparkles}
              href="/recruiter/jobs"
              accent="amber"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-clash text-lg font-bold text-zinc-900">
            Applications
          </h2>
          <div className="max-w-md">
            <AdminStatCard
              label="Total submissions"
              value={appsTotalLoading ? "—" : appTotal}
              hint="Applies to your job posts"
              icon={ClipboardList}
              href="/recruiter/applications"
              accent="slate"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-clash text-lg font-bold tracking-tight text-zinc-900">
                Recent applications
              </h2>
              <p className="mt-1 font-epilogue text-sm text-zinc-500">
                Newest candidates across your listings.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl border-zinc-300"
              >
                <Link href="/recruiter/applications">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/recruiter/jobs">My jobs</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/jobs" target="_blank" rel="noreferrer">
                      Public job board
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <ul className="divide-y divide-zinc-100">
            {recentAppsLoading ? (
              <li className="px-6 py-12 text-center font-epilogue text-sm text-zinc-500">
                Loading…
              </li>
            ) : recentApps.length === 0 ? (
              <li className="px-6 py-14 text-center">
                <p className="font-epilogue text-zinc-600">
                  No applications yet. Publish a role from{" "}
                  <Link
                    href="/recruiter/jobs"
                    className="font-semibold text-primary hover:underline"
                  >
                    My jobs
                  </Link>
                  .
                </p>
              </li>
            ) : (
              recentApps.map((app) => (
                <li
                  key={app.id}
                  className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-zinc-50/80 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-clash font-semibold text-zinc-900">
                      {app.job?.title ?? "Job"}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-epilogue text-sm text-zinc-500">
                      <span>
                        {app.applicant?.user?.name ||
                          app.applicant?.user?.email ||
                          "Applicant"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        {relativePosted(app.createdAt)}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {app.job?.id ? (
                      <Link
                        href={`/jobs/${app.job.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Listing
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-2 font-clash text-xl font-bold text-zinc-900">
              Account
            </h2>
            <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4 font-epilogue text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-500">Verification</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold uppercase",
                    profile?.isVerified
                      ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                      : "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
                  )}
                >
                  {profile?.isVerified ? (
                    <>
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </>
                  ) : (
                    "Pending"
                  )}
                </span>
              </div>
              <Link
                href="/recruiter/profile"
                className="flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                <UserRound className="h-4 w-4" />
                Edit profile
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-clash text-xl font-bold text-zinc-900">
                Recent listings
              </h2>
              <Button asChild variant="ghost" size="sm" className="rounded-lg">
                <Link href="/recruiter/jobs">Manage</Link>
              </Button>
            </div>
            {recentJobsLoading ? (
              <p className="py-6 text-center font-epilogue text-sm text-zinc-500">
                Loading…
              </p>
            ) : recentJobs.length === 0 ? (
              <p className="py-6 text-center font-epilogue text-sm text-zinc-500">
                No jobs yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentJobs.map((job: Job) => {
                  const logoSrc = jobCompanyLogo(job);
                  const company = jobCompanyName(job);
                  return (
                    <li key={job.id}>
                      <Link
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:border-zinc-200 hover:bg-white"
                      >
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-white">
                          <Image
                            src={logoSrc}
                            alt=""
                            fill
                            className="object-contain p-1"
                            sizes="44px"
                            unoptimized={
                              logoSrc.startsWith("http") ||
                              logoSrc.startsWith("//")
                            }
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-clash text-sm font-bold text-zinc-900">
                            {job.title ?? "Untitled"}
                          </p>
                          <p className="mt-0.5 truncate font-epilogue text-xs text-zinc-500">
                            {company} · {jobLocationLine(job)}
                          </p>
                          <p className="mt-1 flex flex-wrap items-center gap-2 font-epilogue text-[11px] text-zinc-400">
                            <span className="inline-flex items-center gap-0.5">
                              <Briefcase className="h-3 w-3" />
                              {formatEmploymentType(job.employmentType) ||
                                formatJobType(job.jobType)}
                            </span>
                            <span className="inline-flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />
                              {relativePosted(job.createdAt)}
                            </span>
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
