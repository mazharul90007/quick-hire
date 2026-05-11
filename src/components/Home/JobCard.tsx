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
      <div className="flex h-full flex-row items-start gap-4 rounded-xl border border-border/60 bg-card p-5 font-epilogue transition-all hover:shadow-xl hover:border-primary/20 group cursor-pointer">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/30 shadow-sm">
          <Image
            src={logoSrc}
            alt={company}
            fill
            className="object-cover"
            unoptimized={logoSrc.startsWith("http")}
          />
        </div>

        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <h3 className="font-clash text-lg font-bold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary sm:text-xl sm:line-clamp-1">
            {job.title}
          </h3>

          <p className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm font-medium text-muted-foreground">
            <span className="truncate">{company}</span>
            <span className="text-border" aria-hidden>
              •
            </span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span className="truncate">
                {job.location || job.district || "Location TBD"}
              </span>
            </span>
          </p>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/80">
            {job.description || "Join the team and build something meaningful."}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
              {formatEmploymentType(job.employmentType)}
            </span>
            <span className="h-4 w-px shrink-0 bg-border" aria-hidden />
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {formatJobType(job.jobType)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
