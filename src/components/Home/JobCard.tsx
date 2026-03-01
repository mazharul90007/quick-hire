import { Job } from "@/types";
import Image from "next/image";
import { MapPin } from "lucide-react";

/**
 * Standard JobCard used for Featured/Latest jobs on the Home page.
 * Maintains the "previous" design the user liked but with overflow protection.
 */
const JobCard = ({ job }: { job: Job }) => {
  const logoSrc = job.companyLogo || "/assets/images/no-image.svg";

  return (
    <div className="bg-white border border-zinc-200 p-6 flex flex-col gap-4 hover:shadow-lg transition-all h-full font-epilogue group cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 relative shrink-0">
          <Image
            src={logoSrc}
            alt={job.companyName || "Company logo"}
            fill
            className="object-cover rounded-full border border-zinc-50 shadow-sm"
          />
        </div>
        <span className="px-3 py-1 border border-[#4640DE] text-[#4640DE] text-[10px] font-bold uppercase tracking-wider">
          {job.employmentType?.replace("_", " ")}
        </span>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <h3 className="text-xl font-bold font-clash text-[#2D2D2D] line-clamp-1 group-hover:text-[#4640DE] transition-colors">
          {job.title}
        </h3>
        <p className="text-zinc-500 text-sm flex items-center gap-1 font-medium">
          <span className="truncate max-w-[120px]">{job.companyName}</span>
          <span className="text-zinc-300">•</span>{" "}
          <span className="flex items-center gap-1 shrink-0">
            <MapPin size={14} className="text-[#4640DE]" />
            {job.district}
          </span>
        </p>
      </div>

      <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
        {job.description || "Join our team and help us build the future."}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {job.tags?.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 text-[11px] font-bold rounded-full ${tag === "Marketing"
                ? "bg-orange-50 text-orange-400 border border-orange-100"
                : tag === "Design"
                  ? "bg-emerald-50 text-emerald-400 border border-emerald-100"
                  : tag === "Business"
                    ? "bg-blue-50 text-blue-400 border border-blue-100"
                    : "bg-zinc-50 text-zinc-500 border border-zinc-100"
              }`}
          >
            {tag}
          </span>
        ))}
        {job.tags && job.tags.length > 3 && (
          <span className="text-zinc-400 text-[10px] font-bold self-center ml-1">+{job.tags.length - 3} More</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
