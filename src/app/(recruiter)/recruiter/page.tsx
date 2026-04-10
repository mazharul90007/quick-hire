"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRecruiterProfile } from "@/hooks/useRecruiterProfile";
import { useGetAllJobs } from "@/hooks/useJob";
import { useGetApplications } from "@/hooks/useApplication";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, ClipboardList, Plus } from "lucide-react";

export default function RecruiterOverviewPage() {
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErr,
  } = useRecruiterProfile();
  const recruiterId = profile?.id;

  const {
    data: jobsRes,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useGetAllJobs(
    {
      recruiterId,
      limit: 1,
      page: 1,
      allStatuses: true,
    },
    { enabled: !!recruiterId },
  );

  const { data: appsRes, isLoading: appsLoading } = useGetApplications({
    limit: 5,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const jobTotal = jobsRes?.meta?.total ?? 0;
  const appTotal = appsRes?.meta?.total ?? 0;
  const recentApps = appsRes?.data ?? [];

  const company = useMemo(
    () => profile?.companyName || profile?.recruiterName || "your company",
    [profile],
  );

  if (profileError) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50/80 p-8 font-epilogue text-rose-900">
        <p className="font-clash text-lg font-bold">Could not load recruiter profile</p>
        <p className="mt-2 text-sm text-rose-800">
          {(profileErr as Error)?.message ||
            "Check that you are signed in as a recruiter and the API is running."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Recruiter home
          </p>
          <h1 className="font-clash text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            {profileLoading ? "…" : company}
          </h1>
          <p className="mt-3 max-w-xl font-epilogue text-lg text-zinc-600">
            Post roles, review candidates who applied to your listings, and keep
            your company page accurate.
          </p>
        </div>
        <Button
          asChild
          className="shrink-0 rounded-xl bg-[#4640DE] font-bold text-white hover:bg-[#3b36c0]"
        >
          <Link href="/recruiter/jobs">
            <Plus className="mr-2 h-4 w-4" />
            Post a job
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="font-epilogue text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Your jobs
              </p>
              <p className="font-clash text-3xl font-bold tabular-nums text-zinc-900">
                {!recruiterId || jobsLoading || jobsError ? "—" : jobTotal}
              </p>
            </div>
          </div>
          <p className="mt-3 font-epilogue text-sm text-zinc-600">
            Active, paused, and removed listings you own.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="font-epilogue text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Applications
              </p>
              <p className="font-clash text-3xl font-bold tabular-nums text-zinc-900">
                {appsLoading ? "—" : appTotal}
              </p>
            </div>
          </div>
          <p className="mt-3 font-epilogue text-sm text-zinc-600">
            Applicants across your active and past postings.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-clash text-lg font-bold text-zinc-900">
            Recent applications
          </h2>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-xl border-zinc-300 sm:w-auto"
          >
            <Link href="/recruiter/applications">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ul className="divide-y divide-zinc-100">
          {appsLoading ? (
            <li className="px-6 py-8 font-epilogue text-zinc-500">Loading…</li>
          ) : recentApps.length === 0 ? (
            <li className="px-6 py-12 text-center font-epilogue text-zinc-500">
              No applications yet. Publish a job from{" "}
              <Link
                href="/recruiter/jobs"
                className="font-semibold text-[#4640DE] hover:underline"
              >
                My jobs
              </Link>
              .
            </li>
          ) : (
            recentApps.map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-epilogue font-semibold text-zinc-900">
                    {app.job?.title ?? "Job"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {app.applicant?.user?.name ||
                      app.applicant?.user?.email ||
                      "Applicant"}{" "}
                    ·{" "}
                    {new Date(app.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
                {app.job?.id ? (
                  <Link
                    href={`/jobs/${app.job.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-sm font-semibold text-[#4640DE] hover:underline"
                  >
                    Open listing
                  </Link>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
