"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetApplications } from "@/hooks/useApplication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Mail,
  Briefcase,
  FileText,
} from "lucide-react";
import type { ApplicationRow } from "@/types";

function ApplicationsAdminPage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const jobFilter = searchParams.get("jobId") || undefined;

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 12;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, jobFilter]);

  const query = useMemo(
    () => ({
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc" as const,
      ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
      ...(jobFilter ? { jobId: jobFilter } : {}),
    }),
    [page, debouncedSearch, jobFilter],
  );

  const { data, isLoading, isFetching } = useGetApplications(query);
  const rows = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta
    ? Math.max(1, Math.ceil(meta.total / meta.limit))
    : 1;

  const scrollToHighlight = useCallback(() => {
    if (!highlightId) return;
    const el = document.getElementById(`app-row-${highlightId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightId]);

  useEffect(() => {
    if (!isLoading && rows.length) scrollToHighlight();
  }, [isLoading, rows.length, scrollToHighlight]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Pipeline
        </p>
        <h1 className="font-clash text-4xl font-bold text-zinc-900">
          Applications
        </h1>
        <p className="mt-2 max-w-2xl font-epilogue text-zinc-600">
          Every submission across the platform. Search covers cover note and
          expected salary fields.
        </p>
      </header>

      {jobFilter && (
        <p className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 font-epilogue text-sm text-indigo-900">
          Filtered by job ID <code className="font-mono text-sm">{jobFilter}</code>.{" "}
          <Link
            href="/dashboard/applications"
            className="font-semibold underline underline-offset-2 hover:text-indigo-700"
          >
            Clear
          </Link>
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search applications…"
            className="h-12 rounded-xl border-zinc-200 bg-white pl-11 text-zinc-900 placeholder:text-zinc-400"
          />
        </div>
        {(isFetching && !isLoading) && (
          <span className="text-sm text-zinc-500 font-epilogue self-center">
            Updating…
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-epilogue">
                  Applicant
                </th>
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-epilogue">
                  Job
                </th>
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-epilogue">
                  Expected salary
                </th>
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-epilogue w-20">
                  CV
                </th>
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-epilogue">
                  Applied
                </th>
                <th className="p-4 md:p-5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-epilogue w-24">
                  Open
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-epilogue">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-5">
                      <div className="h-10 animate-pulse rounded-lg bg-zinc-100" />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-16 text-center text-zinc-500 font-epilogue"
                  >
                    No applications match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((app: ApplicationRow) => {
                  const name =
                    app.applicant?.user?.name ||
                    app.applicant?.user?.email ||
                    "Applicant";
                  const email = app.applicant?.user?.email;
                  const isHi = highlightId === app.id;
                  return (
                    <tr
                      key={app.id}
                      id={`app-row-${app.id}`}
                      className={
                        isHi
                          ? "bg-indigo-50 ring-1 ring-inset ring-indigo-200"
                          : "hover:bg-zinc-50/80"
                      }
                    >
                      <td className="p-4 align-top md:p-5">
                        <div className="font-bold text-zinc-900">{name}</div>
                        {email && (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {email}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-top md:p-5">
                        <div className="flex items-start gap-2">
                          <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                          <div>
                            <div className="font-semibold text-zinc-800">
                              {app.job?.title ?? "—"}
                            </div>
                            {app.job?.recruiter?.companyName && (
                              <div className="text-xs text-zinc-500 mt-0.5">
                                {app.job.recruiter.companyName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top text-sm text-zinc-700 md:p-5">
                        {app.expectedSalary ?? "—"}
                      </td>
                      <td className="p-4 md:p-5 align-top">
                        {app.cv ? (
                          <a
                            href={app.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline"
                          >
                            <FileText className="h-4 w-4 shrink-0" />
                            PDF
                          </a>
                        ) : (
                          <span className="text-zinc-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-4 md:p-5 text-zinc-500 align-top text-sm whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 align-top md:p-5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        >
                          <Link href={`/jobs/${app.jobId}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {meta && totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 bg-zinc-50/50 px-5 py-4 sm:flex-row">
            <p className="font-epilogue text-sm text-zinc-600">
              Page {meta.page} of {totalPages} · {meta.total} total
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl py-24 text-center font-epilogue text-zinc-600">
          Loading applications…
        </div>
      }
    >
      <ApplicationsAdminPage />
    </Suspense>
  );
}
