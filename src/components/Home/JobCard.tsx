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
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white border border-zinc-200 p-6 flex flex-col gap-4 hover:shadow-lg transition-all h-full font-epilogue group cursor-pointer rounded-xl">
        <div className="flex justify-between items-start">
          <div className="w-14 h-14 relative shrink-0">
            <Image
              src={logoSrc}
              alt={company}
              fill
              className="object-cover rounded-full border border-zinc-50 shadow-sm"
              unoptimized={logoSrc.startsWith("http")}
            />
          </div>
          <span className="px-3 py-1 border border-[#4640DE] text-[#4640DE] text-[10px] font-bold uppercase tracking-wider rounded-full">
            {formatEmploymentType(job.employmentType)}
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <h3 className="text-xl font-bold font-clash text-[#2D2D2D] line-clamp-1 group-hover:text-[#4640DE] transition-colors">
            {job.title}
          </h3>
          <p className="text-zinc-500 text-sm flex items-center gap-1 font-medium flex-wrap">
            <span className="truncate max-w-[10rem]">{company}</span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-1 shrink-0">
              <MapPin size={14} className="text-[#4640DE]" />
              {job.location || job.district || "Location TBD"}
            </span>
          </p>
        </div>

        <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
          {job.description || "Join the team and build something meaningful."}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-xs font-semibold font-epilogue rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            {formatEmploymentType(job.employmentType)}
          </span>
          <span className="h-4 w-px bg-zinc-200 self-center" />
          <span className="px-3 py-1 text-xs font-semibold font-epilogue rounded-full bg-orange-50 text-orange-600 border border-orange-100">
            {formatJobType(job.jobType)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
