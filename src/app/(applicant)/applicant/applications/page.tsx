"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useGetApplications } from "@/hooks/useApplication";
import {
  formatEmploymentType,
  formatJobType,
  jobCompanyName,
} from "@/lib/job-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search } from "lucide-react";

export default function ApplicantApplicationsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetApplications({
    limit,
    page,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(searchTerm ? { searchTerm } : {}),
  });

  const rows = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = useMemo(() => (total === 0 ? 0 : (page - 1) * limit + 1), [page, total]);
  const to = useMemo(() => Math.min(page * limit, total), [page, total]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="border-b border-border pb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Applications
        </p>
        <h1 className="mt-2 font-clash text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          My applications
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          A record of every role you have applied for. Open a job to review the
          listing or follow up.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form
            className="flex w-full max-w-md items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearchTerm(searchInput.trim());
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by note or expected salary"
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearchInput("");
                setSearchTerm("");
                setPage(1);
              }}
              disabled={!searchInput && !searchTerm}
            >
              Clear
            </Button>
          </form>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${from}-${to} of ${total}`}
          </p>
        </div>
      </section>

      {/* Mobile: stacked cards */}
      <div className="space-y-3 md:hidden">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
            <p className="text-sm text-muted-foreground">No applications yet.</p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/jobs">Search jobs</Link>
            </Button>
          </div>
        ) : (
          rows.map((app) => {
            const job = app.job;
            const typeLabel =
              job &&
              (formatEmploymentType(job.employmentType) ||
                formatJobType(job.jobType));
            return (
              <div
                key={app.id}
                className="rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        src={job?.recruiter?.companyLogo || "/assets/images/no-image.svg"}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {job?.title ?? "—"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job ? jobCompanyName(job) : "—"}
                    </p>
                    </div>
                  </div>
                  {job?.id ? (
                    <Link
                      href={`/jobs/${job.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      aria-label="Open job"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{typeLabel ?? "—"}</span>
                  <span>
                    Applied{" "}
                    {new Date(app.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {app.expectedSalary ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Expected salary: {app.expectedSalary}
                  </p>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th
                  scope="col"
                  className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Job
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Organization
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Work arrangement
                </th>
                <th
                  scope="col"
                  className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Applied
                </th>
                <th scope="col" className="w-14 px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    Loading applications…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="text-muted-foreground">
                      No applications yet.
                    </p>
                    <Button asChild className="mt-4" size="sm">
                      <Link href="/jobs">Search jobs</Link>
                    </Button>
                  </td>
                </tr>
              ) : (
                rows.map((app) => {
                  const job = app.job;
                  return (
                    <tr
                      key={app.id}
                      className="transition-colors hover:bg-muted/35"
                    >
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            <Image
                              src={
                                job?.recruiter?.companyLogo ||
                                "/assets/images/no-image.svg"
                              }
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {job?.title ?? "—"}
                            </p>
                            {app.expectedSalary ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Expected: {app.expectedSalary}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-muted-foreground">
                        {job ? jobCompanyName(job) : "—"}
                      </td>
                      <td className="px-5 py-4 align-top text-muted-foreground">
                        {job
                          ? formatEmploymentType(job.employmentType) ||
                            formatJobType(job.jobType)
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 align-top text-muted-foreground tabular-nums">
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-right align-top">
                        {job?.id ? (
                          <Link
                            href={`/jobs/${job.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-muted-foreground transition hover:border-border hover:bg-muted hover:text-foreground"
                            aria-label="Open job posting"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
