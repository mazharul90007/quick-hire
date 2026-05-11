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
      <div className="bg-card p-6 flex lg:flex-row lg:items-center flex-col items-start gap-6 border border-border/60 rounded-xl hover:shadow-xl hover:border-primary/20 transition-all group font-epilogue cursor-pointer">
        <div className="w-16 h-16 relative shrink-0 bg-muted/30 rounded-xl p-2 border border-border/50">
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
            <h3 className="text-xl font-semibold font-epilogue text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-muted-foreground font-epilogue text-sm">
              {company}{" "}
              <span className="text-border mx-1">•</span>{" "}
              {job.location || job.district || "Flexible"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs font-semibold font-epilogue rounded-full bg-secondary/10 text-secondary border border-secondary/20">
              {formatEmploymentType(job.employmentType)}
            </span>
            <span className="h-4 w-px bg-border self-center" />
            <span className="px-3 py-1 text-xs font-semibold font-epilogue rounded-full bg-primary/10 text-primary border border-primary/20">
              {formatJobType(job.jobType)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LatestJobCard;
