"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  ClipboardList,
  Clock,
  Layers,
  MapPin,
  MoreVertical,
  ShieldAlert,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useGetAllJobs } from "@/hooks/useJob";
import { useGetApplications } from "@/hooks/useApplication";
import { useGetIndustries } from "@/hooks/useIndustry";
import { AdminStatCard } from "@/components/dashboard/AdminStatCard";
import { useAdminApplicants, useAdminRecruiters } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Job } from "@/types";
import {
  jobCompanyLogo,
  jobCompanyName,
  formatJobType,
  formatEmploymentType,
} from "@/lib/job-display";

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

function splitSalary(s: string): { amount: string; suffix: string } {
  const t = s.trim();
  const slash = t.indexOf("/");
  if (slash === -1) return { amount: t, suffix: "" };
  return {
    amount: t.slice(0, slash).trim(),
    suffix: t.slice(slash).trim(),
  };
}

function jobSkillTags(job: Job): string[] {
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

function jobLocationLine(job: Job): string {
  const parts = [job.location, job.district].filter(Boolean);
  if (parts.length) return parts.join(", ");
  const addr = job.recruiter?.companyAddress;
  if (addr) return addr;
  if (job.jobType === "REMOTE") return "Remote";
  return "—";
}

export default function DashboardOverviewPage() {
  const { data: session } = authClient.useSession();

  const { data: allJobsMeta } = useGetAllJobs({ limit: 1, page: 1 });
  const { data: activeJobsMeta } = useGetAllJobs({
    limit: 1,
    page: 1,
    status: "ACTIVE",
  });
  const { data: featuredJobsMeta } = useGetAllJobs({
    limit: 1,
    page: 1,
    status: "ACTIVE",
    featured: true,
  });
  const { data: verifiedJobsMeta, isLoading: verifiedJobsLoading } =
    useGetAllJobs({
      limit: 1,
      page: 1,
      allStatuses: true,
      isVerified: true,
    });
  const { data: pendingJobsMeta, isLoading: pendingJobsLoading } =
    useGetAllJobs({
      limit: 1,
      page: 1,
      allStatuses: true,
      isVerified: false,
    });
  const { data: applicantsCountRes, isLoading: applicantsCountLoading } =
    useAdminApplicants({ page: 1, limit: 1 });
  const { data: recruitersCountRes, isLoading: recruitersCountLoading } =
    useAdminRecruiters({ page: 1, limit: 1 });
  const { data: recentJobsRes, isLoading: jobsLoading } = useGetAllJobs({
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: appsTotalRes, isLoading: appsLoading } = useGetApplications({
    limit: 1,
    page: 1,
  });
  const { data: industries = [], isLoading: indLoading } = useGetIndustries();

  const totalJobs = allJobsMeta?.meta?.total ?? 0;
  const activeJobs = activeJobsMeta?.meta?.total ?? 0;
  const featuredJobs = featuredJobsMeta?.meta?.total ?? 0;
  const verifiedJobs = verifiedJobsMeta?.meta?.total ?? 0;
  const pendingJobs = pendingJobsMeta?.meta?.total ?? 0;
  const totalApplicants = applicantsCountRes?.meta?.total ?? 0;
  const totalRecruiters = recruitersCountRes?.meta?.total ?? 0;
  const totalApps = appsTotalRes?.meta?.total ?? 0;
  const industryCount = industries.length;

  const recentJobs = recentJobsRes?.data ?? [];

  const industryJobRows = useMemo(() => {
    const rows = industries.map((i) => ({
      id: i.id,
      name: i.name,
      count: i._count?.jobs ?? 0,
    }));
    rows.sort((a, b) => b.count - a.count);
    const max = Math.max(...rows.map((r) => r.count), 1);
    return rows.map((r) => ({
      ...r,
      pct: r.count === 0 ? 0 : Math.round((r.count / max) * 100),
    }));
  }, [industries]);

  const subIndustryTotal = useMemo(
    () =>
      industries.reduce((s, i) => s + (i.subIndustries?.length ?? 0), 0),
    [industries],
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Control center
          </p>
          <h1 className="font-clash text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            Welcome back
            {session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-3 max-w-xl font-epilogue text-lg text-zinc-600">
            Monitor listings, applications, and taxonomy from your live API.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="rounded-xl bg-zinc-900 font-bold text-white hover:bg-zinc-800"
          >
            <Link href="/dashboard/applications">
              Review applications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-zinc-300 bg-white font-bold text-zinc-800 hover:bg-zinc-50"
          >
            <Link href="/dashboard/jobs">Browse jobs</Link>
          </Button>
        </div>
      </header>

      <section className="space-y-8">
        <div>
          <h2 className="mb-3 font-clash text-lg font-bold text-zinc-900">
            Verification & people
          </h2>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Verified jobs"
              value={verifiedJobsLoading ? "—" : verifiedJobs}
              hint="Moderation approved (all statuses)"
              icon={BadgeCheck}
              href="/dashboard/jobs"
              accent="emerald"
            />
            <AdminStatCard
              label="Pending verification"
              value={pendingJobsLoading ? "—" : pendingJobs}
              hint="Awaiting admin review"
              icon={ShieldAlert}
              href="/dashboard/jobs"
              accent="rose"
            />
            <AdminStatCard
              label="Registered applicants"
              value={applicantsCountLoading ? "—" : totalApplicants}
              hint="Applicant profiles in the system"
              icon={Users}
              href="/dashboard/users?tab=applicants"
              accent="violet"
            />
            <AdminStatCard
              label="Recruiters"
              value={recruitersCountLoading ? "—" : totalRecruiters}
              hint="Companies with recruiter accounts"
              icon={Building2}
              href="/dashboard/users?tab=recruiters"
              accent="cyan"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-clash text-lg font-bold text-zinc-900">
            Jobs & activity
          </h2>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Total jobs"
              value={jobsLoading ? "—" : totalJobs}
              hint="All statuses in database"
              icon={Briefcase}
              href="/dashboard/jobs"
              accent="indigo"
            />
            <AdminStatCard
              label="Active listings"
              value={jobsLoading ? "—" : activeJobs}
              hint="Visible on public job board"
              icon={TrendingUp}
              href="/jobs"
              accent="sky"
            />
            <AdminStatCard
              label="Application submissions"
              value={appsLoading ? "—" : totalApps}
              hint="Total apply events (role-scoped on API)"
              icon={ClipboardList}
              href="/dashboard/applications"
              accent="slate"
            />
            <AdminStatCard
              label="Featured active"
              value={jobsLoading ? "—" : featuredJobs}
              hint="Promoted & active jobs"
              icon={Star}
              accent="amber"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-clash text-xl font-bold text-zinc-900">
                <Building2 className="h-5 w-5 text-zinc-600" />
                Jobs by industry
              </h2>
              <p className="mt-1 font-epilogue text-sm text-zinc-500">
                Total jobs per industry (live counts from your database).
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="shrink-0 rounded-lg border-zinc-300 text-zinc-800 hover:bg-zinc-50"
            >
              <Link href="/dashboard/categories">Manage</Link>
            </Button>
          </div>
          {indLoading ? (
            <p className="py-10 text-center font-epilogue text-sm text-zinc-500">
              Loading industries…
            </p>
          ) : industryJobRows.length === 0 ? (
            <p className="py-10 text-center font-epilogue text-sm text-zinc-500">
              No industries yet. Add some under taxonomy.
            </p>
          ) : (
            <ul className="divide-y divide-dashed divide-zinc-200">
              {industryJobRows.map((row) => (
                <li key={row.id}>
                  <div className="grid grid-cols-1 items-center gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_3.5rem_minmax(6rem,1.2fr)] sm:gap-4 md:py-5">
                    <span
                      className="min-w-0 font-epilogue text-sm font-medium text-zinc-900 sm:text-base"
                      title={row.name}
                    >
                      <span className="block truncate">{row.name}</span>
                    </span>
                    <span className="font-epilogue text-sm tabular-nums text-zinc-800 sm:text-right">
                      {row.count}
                    </span>
                    <div className="h-3 w-full min-w-0 overflow-hidden rounded-full bg-zinc-100 sm:h-3.5">
                      <div
                        className="h-full rounded-full bg-[#4640DE] transition-[width] duration-500 ease-out"
                        style={{ width: `${row.pct}%` }}
                        role="presentation"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-2 font-clash text-xl font-bold text-zinc-900">
            Taxonomy
          </h2>
          <p className="mb-6 font-epilogue text-sm text-zinc-500">
            Industries and specializations powering job filters.
          </p>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 py-3">
              <span className="font-epilogue text-zinc-600">Industries</span>
              <span className="font-clash text-2xl font-bold text-zinc-900">
                {indLoading ? "—" : industryCount}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-100 py-3">
              <span className="font-epilogue text-zinc-600">Sub-industries</span>
              <span className="font-clash text-2xl font-bold text-zinc-900">
                {indLoading ? "—" : subIndustryTotal}
              </span>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="mt-6 rounded-xl border-zinc-300 text-zinc-800 hover:bg-zinc-50"
          >
            <Link href="/dashboard/categories">Manage industries</Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">
            <h2 className="font-clash text-lg font-bold tracking-tight text-zinc-900">
              Latest Jobs
            </h2>
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
                  <Link href="/dashboard/jobs">View all jobs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/jobs" target="_blank" rel="noreferrer">
                    Public job board
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            {jobsLoading ? (
              <p className="py-10 text-center font-epilogue text-sm text-zinc-500">
                Loading…
              </p>
            ) : recentJobs.length === 0 ? (
              <p className="py-10 text-center font-epilogue text-sm text-zinc-500">
                No jobs yet.
              </p>
            ) : (
              recentJobs.map((job: Job) => {
                const logoSrc = jobCompanyLogo(job);
                const company = jobCompanyName(job);
                const skillList = jobSkillTags(job);
                const skills =
                  skillList.length > 0
                    ? skillList
                    : job.industry?.name
                      ? [job.industry.name]
                      : [];
                const sal = job.salary?.trim();
                const { amount: salAmount, suffix: salSuffix } = sal
                  ? splitSalary(sal)
                  : { amount: "", suffix: "" };

                return (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50/80 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50">
                        <Image
                          src={logoSrc}
                          alt={company}
                          fill
                          className="object-contain p-1.5"
                          sizes="48px"
                          unoptimized={
                            logoSrc.startsWith("http") ||
                            logoSrc.startsWith("//")
                          }
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-clash text-base font-bold leading-snug text-zinc-900 sm:text-lg">
                          {job.title ?? "Untitled"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-epilogue text-xs text-zinc-500 sm:text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase
                              className="h-3.5 w-3.5 shrink-0 text-zinc-400"
                              aria-hidden
                            />
                            {formatEmploymentType(job.employmentType) ||
                              formatJobType(job.jobType)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock
                              className="h-3.5 w-3.5 shrink-0 text-zinc-400"
                              aria-hidden
                            />
                            {relativePosted(job.createdAt)}
                          </span>
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <MapPin
                              className="h-3.5 w-3.5 shrink-0 text-zinc-400"
                              aria-hidden
                            />
                            <span className="truncate">
                              {jobLocationLine(job)}
                            </span>
                          </span>
                        </div>
                      </div>

                      {skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 lg:max-w-[220px] lg:justify-end">
                          {skills.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-[#4640DE]/10 px-2.5 py-1 font-epilogue text-[11px] font-semibold text-[#4640DE]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="shrink-0 text-left lg:text-right">
                        {sal ? (
                          <>
                            <span className="font-clash text-lg font-bold tabular-nums text-[#4640DE]">
                              {salAmount}
                            </span>
                            {salSuffix ? (
                              <span className="font-epilogue text-sm text-zinc-500">
                                {" "}
                                {salSuffix}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="font-epilogue text-sm text-zinc-400">
                            Salary not listed
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-100/80 p-8 md:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-clash text-2xl font-bold text-zinc-900">
              Need to add a sector?
            </h2>
            <p className="mt-2 max-w-lg font-epilogue text-zinc-600">
              Create industries and sub-industries so recruiters can classify
              new posts. Changes apply immediately to job board filters.
            </p>
          </div>
          <Button
            asChild
            className="h-12 shrink-0 rounded-xl bg-zinc-900 px-8 font-bold text-white hover:bg-zinc-800"
          >
            <Link href="/dashboard/categories">
              <Layers className="mr-2 h-4 w-4" />
              Open taxonomy
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
