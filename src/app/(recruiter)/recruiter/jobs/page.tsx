"use client";

import { useState } from "react";
import Link from "next/link";
import { useRecruiterProfile } from "@/hooks/useRecruiterProfile";
import { useGetAllJobs } from "@/hooks/useJob";
import type { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, PencilLine } from "lucide-react";
import CreateJobModal from "@/components/dashboard/CreateJobModal";
import { formatEmploymentType, formatJobType } from "@/lib/job-display";
import UpdateJobModal from "@/components/dashboard/UpdateJobModal";

export default function RecruiterJobsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
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

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Listings
          </p>
          <h1 className="font-clash text-4xl font-bold text-zinc-900">My jobs</h1>
          <p className="mt-2 font-epilogue text-zinc-600">
            Create and manage postings tied to your recruiter account.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setModalOpen(true)}
          className="shrink-0 rounded-xl bg-[#4640DE] font-bold text-white hover:bg-[#3b36c0]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New job
        </Button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  Title
                </th>
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  Type
                </th>
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  Status
                </th>
                <th className="p-4 font-epilogue text-[11px] font-bold tracking-wider text-zinc-500 uppercase md:p-5">
                  Posted
                </th>
                <th className="p-4 md:p-5 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-epilogue">
              {profileLoading || !recruiterId ? (
                <tr>
                  <td colSpan={5} className="p-8 text-zinc-500">
                    Loading…
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-zinc-500">
                    Loading jobs…
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    You have not posted a job yet. Use &quot;New job&quot; to
                    create one.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-zinc-50/80">
                    <td className="p-4 align-top md:p-5">
                      <p className="font-semibold text-zinc-900">
                        {job.title ?? "—"}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {job.location ?? "—"}
                      </p>
                    </td>
                    <td className="p-4 align-top text-sm text-zinc-700 md:p-5">
                      {formatEmploymentType(job.employmentType) ||
                        formatJobType(job.jobType)}
                    </td>
                    <td className="p-4 align-top md:p-5">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase ring-1 ring-inset ${
                          job.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 ring-emerald-200/80"
                            : job.status === "PAUSED"
                              ? "bg-amber-50 text-amber-900 ring-amber-200/80"
                              : "bg-zinc-100 text-zinc-600 ring-zinc-200"
                        }`}
                      >
                        {job.status ?? "—"}
                      </span>
                    </td>
                    <td className="p-4 align-top text-sm text-zinc-600 md:p-5">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right md:p-5">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                          onClick={() => {
                            setEditingJob(job);
                            setEditOpen(true);
                          }}
                          aria-label="Edit job"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Link
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                          aria-label="View public listing"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateJobModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <UpdateJobModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        job={editingJob}
      />
    </div>
  );
}
