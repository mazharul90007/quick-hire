import { Job } from "@/types";
import Image from "next/image";

const LatestJobCard = ({ job }: { job: Job }) => {
  const logoSrc = job.companyLogo || "/assets/images/no-image.svg";

  return (
    <div className="bg-white p-6 flex lg:flex-row lg:items-center flex-col items-start gap-6 border border-zinc-100/50 hover:shadow-lg transition-all group font-epilogue">
      <div className="w-16 h-16 relative shrink-0 bg-white rounded-lg p-2 border">
        <Image
          src={logoSrc}
          alt={job.companyName || "Company logo"}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold font-epilogue text-[#2D2D2D] line-clamp-1 group-hover:text-[#4640DE] transition-colors">
            {job.title}
          </h3>
          <p className="text-zinc-500 font-epilogue text-sm">
            {job.companyName} <span className="text-zinc-300 mx-1">•</span>{" "}
            {job.location || job.district}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-xs font-semibold font-epilogue rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
            {job.employmentType?.replace("_", " ")}
          </span>
          <span className="h-4 w-px bg-zinc-200 self-center" />
          <span className="px-3 py-1 text-xs font-semibold font-epilogue rounded-full bg-orange-50 text-orange-500 border border-orange-100">
            {job.jobType?.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LatestJobCard;
