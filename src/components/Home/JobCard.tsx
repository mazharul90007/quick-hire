import { Job } from "@/types";
import Image from "next/image";

const JobCard = ({ job }: { job: Job }) => {
  const logoSrc = job.companyLogo || "/assets/images/no-image.svg";

  return (
    <div className="bg-white border border-zinc-200 p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow h-full">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 relative rounded-full">
          <Image
            src={logoSrc}
            alt={job.companyName || "Comapany img"}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <span className="px-3 py-1 border border-[#4640DE] text-[#4640DE] text-sm font-epilogue uppercase tracking-wider">
          {job.employmentType}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold font-clash text-[#2D2D2D] line-clamp-1">
          {job.title}
        </h3>
        <p className="text-zinc-500 font-epilogue text-sm flex items-center gap-1">
          {job.companyName} <span className="text-zinc-300">•</span>{" "}
          {job.district}
        </p>
      </div>

      <p className="text-zinc-500 font-epilogue text-sm line-clamp-2">
        {job.description}
      </p>

      <div className="grid lg:grid-cols-4 gap-2 mt-auto">
        {job.tags?.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 text-xs font-semibold font-epilogue rounded-full ${tag === "Marketing"
                ? "bg-orange-50 text-orange-400"
                : tag === "Design"
                  ? "bg-emerald-50 text-emerald-400"
                  : tag === "Business"
                    ? "bg-blue-50 text-blue-400"
                    : "bg-zinc-100 text-zinc-500"
              }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default JobCard;
