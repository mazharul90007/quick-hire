import { Job } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  jobCompanyLogo,
  jobCompanyName,
  formatJobType,
  formatEmploymentType,
} from "@/lib/job-display";

const LatestJobCard = ({ job }: { job: Job }) => {
  const logoSrc = jobCompanyLogo(job);
  const company = jobCompanyName(job);

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="bg-white p-6 flex lg:flex-row lg:items-center flex-col items-start gap-6 border border-zinc-100/80 rounded-xl hover:shadow-lg transition-all group font-epilogue cursor-pointer">
        <div className="w-16 h-16 relative shrink-0 bg-white rounded-xl p-2 border">
          <Image
            src={logoSrc}
            alt={company}
            fill
            className="object-cover rounded-lg"
            unoptimized={logoSrc.startsWith("http")}
          />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold font-epilogue text-[#2D2D2D] line-clamp-1 group-hover:text-[#4640DE] transition-colors">
              {job.title}
            </h3>
            <p className="text-zinc-500 font-epilogue text-sm">
              {company}{" "}
              <span className="text-zinc-300 mx-1">•</span>{" "}
              {job.location || job.district || "Flexible"}
            </p>
          </div>

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
      </div>
    </Link>
  );
};

export default LatestJobCard;
