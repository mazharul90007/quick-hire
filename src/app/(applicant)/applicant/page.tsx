"use client";

import Link from "next/link";
import { useApplicantProfile } from "@/hooks/useApplicantProfile";
import { useGetApplications } from "@/hooks/useApplication";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  ChevronRight,
  ClipboardList,
  User,
} from "lucide-react";

export default function ApplicantOverviewPage() {
  const { data: profile, isLoading: profileLoading } = useApplicantProfile();
  const { data: appsRes, isLoading: appsLoading } = useGetApplications({
    limit: 5,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const totalApps = appsRes?.meta?.total ?? 0;
  const recent = appsRes?.data ?? [];
  const firstName =
    profile?.name?.split(" ")[0] ||
    profile?.user?.name?.split(" ")[0] ||
    "there";

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="border-b border-border pb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Overview
        </p>
        <h1 className="mt-2 font-clash text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {profileLoading ? (
            <span className="inline-block h-9 w-48 animate-pulse rounded bg-muted" />
          ) : (
            <>Welcome back, {firstName}</>
          )}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Monitor your job applications and keep your candidate profile up to
          date for recruiters.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card px-5 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Applications submitted
              </p>
              <p className="mt-2 font-clash text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {appsLoading ? "—" : totalApps}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
              <ClipboardList className="h-5 w-5" strokeWidth={1.75} />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Total roles you have applied for on this platform.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card px-5 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Account type
              </p>
              <p className="mt-2 font-clash text-lg font-semibold tracking-tight text-foreground">
                {profileLoading ? "—" : (profile?.userType ?? "Standard")}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
              <User className="h-5 w-5" strokeWidth={1.75} />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Résumé and contact details are managed under{" "}
            <Link
              href="/applicant/profile"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Profile
            </Link>
            .
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-clash text-base font-semibold text-foreground">
              Recent applications
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Latest submissions, newest first
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href="/applicant/applications">
              View all
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ul className="divide-y divide-border">
          {appsLoading ? (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              Loading applications…
            </li>
          ) : recent.length === 0 ? (
            <li className="px-5 py-14 text-center">
              <Briefcase
                className="mx-auto h-10 w-10 text-muted-foreground/50"
                strokeWidth={1.25}
              />
              <p className="mt-4 text-sm text-muted-foreground">
                You have not applied to any jobs yet.
              </p>
              <Button asChild className="mt-5" size="sm">
                <Link href="/jobs">Browse job openings</Link>
              </Button>
            </li>
          ) : (
            recent.map((app) => (
              <li key={app.id}>
                <Link
                  href={`/jobs/${app.jobId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground group-hover:text-primary">
                      {app.job?.title ?? "Position"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Applied{" "}
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
