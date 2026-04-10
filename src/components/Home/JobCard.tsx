import { Job } from "@/types";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Link from "next/link";
import {
  jobCompanyLogo,
  jobCompanyName,
  formatJobType,
  formatEmploymentType,
} from "@/lib/job-display";

const JobCard = ({ job }: { job: Job }) => {
  const logoSrc = jobCompanyLogo(job);
  const company = jobCompanyName(job);

  return (
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <div className="flex h-full flex-row items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 font-epilogue transition-all hover:shadow-lg group cursor-pointer">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 shadow-sm">
          <Image
            src={logoSrc}
            alt={company}
            fill
            className="object-cover"
            unoptimized={logoSrc.startsWith("http")}
          />
        </div>

        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <h3 className="font-clash text-lg font-bold leading-snug text-[#2D2D2D] line-clamp-2 transition-colors group-hover:text-[#4640DE] sm:text-xl sm:line-clamp-1">
            {job.title}
          </h3>

          <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm font-medium text-zinc-500">
            <span className="truncate">{company}</span>
            <span className="text-zinc-300" aria-hidden>
              •
            </span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin size={14} className="shrink-0 text-[#4640DE]" />
              <span className="truncate">
                {job.location || job.district || "Location TBD"}
              </span>
            </span>
          </p>

          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {job.description || "Join the team and build something meaningful."}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              {formatEmploymentType(job.employmentType)}
            </span>
            <span className="h-4 w-px shrink-0 bg-zinc-200" aria-hidden />
            <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              {formatJobType(job.jobType)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
