"use client";

import Link from "next/link";
import { useGetApplications } from "@/hooks/useApplication";
import { formatEmploymentType, formatJobType, jobCompanyName } from "@/lib/job-display";
import { ExternalLink, Mail } from "lucide-react";

export default function RecruiterApplicationsPage() {
  const { data, isLoading } = useGetApplications({
    limit: 50,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const rows = data?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Hiring pipeline
        </p>
        <h1 className="font-clash text-4xl font-bold text-zinc-900">
          Applications
        </h1>
        <p className="mt-2 max-w-2xl font-epilogue text-zinc-600">
          Candidates who applied to your job posts. Data is scoped by the
          server to your recruiter account.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  Candidate
                </th>
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  Job
                </th>
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  Type
                </th>
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  Applied
                </th>
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  CV
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-epilogue">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-zinc-500">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    No applications yet.
                  </td>
                </tr>
              ) : (
                rows.map((app) => {
                  const job = app.job;
                  const email = app.applicant?.user?.email;
                  return (
                    <tr key={app.id} className="hover:bg-zinc-50/80">
                      <td className="p-4 align-top md:p-5">
                        <p className="font-semibold text-zinc-900">
                          {app.applicant?.user?.name ||
                            app.applicant?.name ||
                            "Applicant"}
                        </p>
                        {email ? (
                          <a
                            href={`mailto:${email}`}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-[#4640DE] hover:underline"
                          >
                            <Mail className="h-3 w-3" />
                            {email}
                          </a>
                        ) : null}
                      </td>
                      <td className="p-4 align-top text-sm text-zinc-800 md:p-5">
                        <p className="font-medium">{job?.title ?? "—"}</p>
                        <p className="text-xs text-zinc-500">
                          {job ? jobCompanyName(job) : ""}
                        </p>
                      </td>
                      <td className="p-4 align-top text-sm text-zinc-600 md:p-5">
                        {job
                          ? formatEmploymentType(job.employmentType) ||
                            formatJobType(job.jobType)
                          : "—"}
                      </td>
                      <td className="p-4 align-top text-sm text-zinc-600 md:p-5">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-top md:p-5">
                        {app.cv ? (
                          <a
                            href={app.cv}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#4640DE] hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open CV
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
