"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRecruiterProfile } from "@/hooks/useRecruiterProfile";
import { useGetAllJobs } from "@/hooks/useJob";
import type { Job } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ExternalLink,
  PencilLine,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  TrendingUp,
  PauseCircle,
  BadgeCheck,
  Clock,
} from "lucide-react";
import CreateJobModal from "@/components/dashboard/CreateJobModal";
import { formatEmploymentType, formatJobType } from "@/lib/job-display";
import UpdateJobModal from "@/components/dashboard/UpdateJobModal";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "ACTIVE" | "PAUSED" | "DELETED";

function statusBadgeClasses(status: Job["status"]) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200/90";
    case "PAUSED":
      return "bg-amber-50 text-amber-900 ring-amber-200/90";
    case "DELETED":
      return "bg-zinc-100 text-zinc-600 ring-zinc-200";
    default:
      return "bg-zinc-100 text-zinc-600 ring-zinc-200";
  }
}

function formatPosted(createdAt: string) {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RecruiterJobCard({
  job,
  onEdit,
}: {
  job: Job;
  onEdit: (j: Job) => void;
}) {
  const typeLine =
    formatEmploymentType(job.employmentType) || formatJobType(job.jobType);
  const loc = [job.location, job.district].filter(Boolean).join(", ") || null;

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all duration-300",
        "hover:border-[#4640DE]/30 hover:shadow-xl hover:shadow-indigo-100/40",
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#4640DE] via-[#5b54e8] to-[#3530b8] opacity-90"
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-5 pt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
              statusBadgeClasses(job.status),
            )}
          >
            {job.status ?? "—"}
          </span>
          {job.isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 ring-1 ring-inset ring-indigo-200/80">
              <BadgeCheck className="h-3 w-3" aria-hidden />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-500 ring-1 ring-inset ring-zinc-200">
              <Clock className="h-3 w-3" aria-hidden />
              Pending review
            </span>
          )}
          {job.featured ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800 ring-1 ring-inset ring-amber-200/90">
              <Sparkles className="h-3 w-3" aria-hidden />
              Featured
            </span>
          ) : null}
        </div>

        <h2 className="font-clash text-lg font-bold leading-snug text-zinc-900 line-clamp-2">
          {job.title ?? "Untitled role"}
        </h2>

        <div className="mt-3 space-y-1.5 font-epilogue text-sm text-zinc-500">
          {loc && (
            <p className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[#4640DE]"
                aria-hidden
              />
              <span className="line-clamp-2">{loc}</span>
            </p>
          )}
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
            Posted {formatPosted(job.createdAt)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-100">
            {typeLine}
          </span>
          <span className="rounded-lg bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-100">
            {formatJobType(job.jobType)}
          </span>
        </div>

        {job.salary?.trim() ? (
          <p className="mt-4 font-epilogue text-sm font-semibold text-[#4640DE]">
            {job.salary.trim()}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-zinc-200 font-semibold hover:bg-zinc-50 sm:flex-none"
            onClick={() => onEdit(job)}
          >
            <PencilLine className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-zinc-200 font-semibold hover:bg-zinc-50 sm:flex-none"
            asChild
          >
            <Link href={`/jobs/${job.id}`} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View listing
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "indigo" | "emerald" | "amber" | "zinc";
}) {
  const tones = {
    indigo: "from-indigo-50 to-violet-50/80 text-indigo-950 ring-indigo-100",
    emerald: "from-emerald-50 to-teal-50/70 text-emerald-950 ring-emerald-100",
    amber: "from-amber-50 to-orange-50/60 text-amber-950 ring-amber-100",
    zinc: "from-zinc-50 to-zinc-100/80 text-zinc-800 ring-zinc-200",
  };
  const iconTones = {
    indigo: "text-indigo-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    zinc: "text-zinc-500",
  };
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-linear-to-br p-4 ring-1 ring-inset",
        tones[tone],
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm",
          iconTones[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-epilogue text-[11px] font-bold uppercase tracking-wider opacity-70">
          {label}
        </p>
        <p className="font-clash text-2xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export default function RecruiterJobsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");

  const { data: profile, isLoading: profileLoading } = useRecruiterProfile();
  const recruiterId = profile?.id;

  const { data: jobsRes, isLoading } = useGetAllJobs(
    {
      recruiterId,
      limit: 50,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
      allStatuses: true,
    },
    { enabled: !!recruiterId },
  );

  const jobs = jobsRes?.data ?? [];

  const stats = useMemo(() => {
    const active = jobs.filter((j) => j.status === "ACTIVE").length;
    const paused = jobs.filter((j) => j.status === "PAUSED").length;
    const featured = jobs.filter((j) => Boolean(j.featured)).length;
    const pendingVerify = jobs.filter((j) => !j.isVerified).length;
    return { total: jobs.length, active, paused, featured, pendingVerify };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (filter === "all") return jobs;
    return jobs.filter((j) => j.status === filter);
  }, [jobs, filter]);

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "ACTIVE", label: "Live" },
    { id: "PAUSED", label: "Paused" },
    { id: "DELETED", label: "Archived" },
  ];

  const showInitialLoad = profileLoading || !recruiterId;
  const showJobsLoad = !showInitialLoad && isLoading;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm">
        <div
          className="absolute inset-0 bg-linear-to-br from-[#4640DE]/12 via-transparent to-violet-200/20"
          aria-hidden
        />
        <div
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#4640DE]/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between md:p-8">
          <div>
            <p className="mb-2 font-epilogue text-xs font-bold uppercase tracking-[0.2em] text-[#4640DE]">
              Your listings
            </p>
            <h1 className="font-clash text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              My jobs
            </h1>
            <p className="mt-2 max-w-lg font-epilogue text-zinc-600">
              Post roles, track verification, and edit listings anytime. Live
              jobs appear on the public board once approved.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="shrink-0 rounded-lg px-6 py-4 font-bold shadow-lg shadow-primary/25 cursor-pointer"
          >
            <Plus className="mr-1 h-5 w-5" />
            New job
          </Button>
        </div>
      </div>

      {!showInitialLoad && !showJobsLoad && jobs.length > 0 && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <StatPill
            icon={Briefcase}
            label="Total"
            value={stats.total}
            tone="indigo"
          />
          <StatPill
            icon={TrendingUp}
            label="Live"
            value={stats.active}
            tone="emerald"
          />
          <StatPill
            icon={PauseCircle}
            label="Paused"
            value={stats.paused}
            tone="amber"
          />
          <StatPill
            icon={Sparkles}
            label="Featured"
            value={stats.featured}
            tone="amber"
          />
        </div>
      )}

      {!showInitialLoad && !showJobsLoad && jobs.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-epilogue text-sm text-zinc-500">
            {stats.pendingVerify > 0 ? (
              <>
                <span className="font-semibold text-amber-800">
                  {stats.pendingVerify}
                </span>{" "}
                {stats.pendingVerify === 1 ? "job needs" : "jobs need"} admin
                verification before full visibility.
              </>
            ) : (
              "All current jobs are verified or awaiting your updates."
            )}
          </p>
          <div
            className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-1.5"
            role="tablist"
            aria-label="Filter jobs"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={filter === t.id}
                onClick={() => setFilter(t.id)}
                className={cn(
                  "rounded-xl px-4 py-2 font-epilogue text-sm font-semibold transition-colors",
                  filter === t.id
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/80"
                    : "text-zinc-500 hover:text-zinc-800",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showInitialLoad || showJobsLoad ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/80"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4640DE]/10 text-[#4640DE]">
            <Briefcase className="h-8 w-8" />
          </div>
          <h2 className="font-clash text-xl font-bold text-zinc-900">
            No jobs yet
          </h2>
          <p className="mt-2 max-w-sm font-epilogue text-zinc-600">
            Create your first listing to attract candidates. You can set salary,
            requirements, and industry in a few minutes.
          </p>
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-6 rounded-xl px-6 font-bold shadow-md shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post a job
          </Button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-14 text-center shadow-sm">
          <p className="font-epilogue text-zinc-600">
            No jobs in this filter. Try another tab or post a new role.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => setFilter("all")}
          >
            Show all jobs
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <RecruiterJobCard
              key={job.id}
              job={job}
              onEdit={(j) => {
                setEditingJob(j);
                setEditOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <CreateJobModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <UpdateJobModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        job={editingJob}
      />
    </div>
  );
}
