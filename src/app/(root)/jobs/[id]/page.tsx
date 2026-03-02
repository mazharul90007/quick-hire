"use client";

import { useGetSingleJob } from "@/hooks/useJob";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import ApplyJobModal from "@/components/Jobs/ApplyJobModal";

const JobDetailsPage = () => {
  const { id } = useParams() as { id: string };
  const { data: jobResponse, isLoading, error } = useGetSingleJob(id);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-epilogue text-zinc-500 animate-pulse">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !jobResponse?.success) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-zinc-900 font-clash mb-2">
          Job Not Found
        </h2>
        <p className="text-zinc-600 font-epilogue mb-6 text-center max-w-md">
          The job you are looking for might have been removed or is no longer
          available.
        </p>
        <Link href="/jobs">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowLeft size={18} className="mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  const job = jobResponse.data;
  const logoSrc = job.companyLogo || "/assets/images/no-image.svg";

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-zinc-100 pt-32 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 relative shrink-0 bg-white rounded-lg border border-zinc-100 p-2 shadow-sm">
                <Image
                  src={logoSrc}
                  alt={job.companyName || "Company name"}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold font-clash text-[#2D2D2D]">
                    {job.title}
                  </h1>
                  <span className="px-4 py-1.5 text-xs font-bold font-epilogue rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
                    {job.jobType?.replace("_", " ")}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#515B6F] font-epilogue">
                  <span className="font-semibold text-zinc-900 text-lg">
                    {job.companyName}
                  </span>
                  <span className="hidden md:inline text-zinc-300">•</span>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-indigo-600" />
                    <span>{job.location || job.district}</span>
                  </div>
                  <span className="hidden md:inline text-zinc-300">•</span>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-indigo-600" />
                    <span>{job.employmentType?.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsApplyModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-epilogue px-6 py-6 text-lg shadow-xl shadow-indigo-500/20 w-full md:w-auto cursor-pointer"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold font-clash text-[#2D2D2D]">
                Description
              </h2>
              <p className="text-[#515B6F] font-epilogue leading-relaxed text-lg whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-clash text-[#2D2D2D]">
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-[#515B6F] font-epilogue text-lg leading-relaxed"
                    >
                      <CheckCircle2
                        size={20}
                        className="text-teal-500 shrink-0 mt-1"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Requirements */}
            {job.additionalReqirements &&
              job.additionalReqirements.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold font-clash text-[#2D2D2D]">
                    Requirement
                  </h2>
                  <ul className="space-y-3">
                    {job.additionalReqirements.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-[#515B6F] font-epilogue text-lg leading-relaxed"
                      >
                        <CheckCircle2
                          size={20}
                          className="text-teal-500 shrink-0 mt-1"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {/* Skills */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-clash text-[#2D2D2D]">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-6 py-2 bg-white border border-zinc-200 text-[#4640DE] font-semibold font-epilogue rounded-lg shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-clash text-[#2D2D2D]">
                  Nice-to-Haves
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-[#515B6F] font-epilogue text-lg leading-relaxed"
                    >
                      <CheckCircle2
                        size={20}
                        className="text-teal-500 shrink-0 mt-1"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Job Summary Card */}
            <div className="bg-white border border-zinc-100 p-8 rounded-2xl shadow-sm space-y-8">
              <h3 className="text-xl font-bold font-clash text-[#2D2D2D]">
                Job Summary
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <SummaryItem
                  icon={<DollarSign className="text-indigo-600" />}
                  label="Salary"
                  value={job.salary || "Negotiable"}
                />
                <SummaryItem
                  icon={<Briefcase className="text-indigo-600" />}
                  label="Experience"
                  value={job.experience || "N/A"}
                />
                <SummaryItem
                  icon={<Users className="text-indigo-600" />}
                  label="Vacancy"
                  value={job.vacancy ? `${job.vacancy} Positions` : "N/A"}
                />
                <SummaryItem
                  icon={<GraduationCap className="text-indigo-600" />}
                  label="Education"
                  value={job.education || "N/A"}
                />
                <SummaryItem
                  icon={<Clock className="text-indigo-600" />}
                  label="Job Type"
                  value={job.jobType?.replace("_", " ")}
                />
                <SummaryItem
                  icon={<Calendar className="text-indigo-600" />}
                  label="Deadline"
                  value={job.deadline ? new Date(job.deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }) : "N/A"}
                />
              </div>

              <div className="pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <span className="font-bold text-lg">
                      {job.category?.title?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-epilogue">
                      Category
                    </p>
                    <p className="font-bold text-[#2D2D2D] font-epilogue">
                      {job.category?.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info Card */}
            <div className="bg-white border border-zinc-100 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 relative shrink-0">
                  <Image
                    src={logoSrc}
                    alt={job.companyName || "Company logo"}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#2D2D2D] font-epilogue text-lg">
                    {job.companyName || "N/A"}
                  </h4>
                  <Link
                    href={`/companies/${(job.companyName || "unknown").toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-indigo-600 text-sm font-semibold hover:underline"
                  >
                    View profile
                  </Link>
                </div>
              </div>
              <p className="text-[#515B6F] font-epilogue text-sm leading-relaxed">
                {job.companyDetails}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
      />
    </div>
  );
};

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const SummaryItem = ({ icon, label, value }: SummaryItemProps) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-zinc-500 font-epilogue uppercase tracking-wider font-bold">
        {label}
      </p>
      <p className="font-bold text-[#2D2D2D] font-epilogue">{value}</p>
    </div>
  </div>
);

export default JobDetailsPage;
