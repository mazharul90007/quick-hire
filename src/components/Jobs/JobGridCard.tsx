"use client";

import { Job } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  jobCompanyLogo,
  jobCompanyName,
  formatEmploymentType,
} from "@/lib/job-display";

interface JobGridCardProps {
  job: Job;
}

const JobGridCard = ({ job }: JobGridCardProps) => {
  const logoSrc = jobCompanyLogo(job);
  const company = jobCompanyName(job);

  return (
    <div className="bg-card border border-border/50 p-6 flex flex-col gap-6 hover:border-primary/50 hover:shadow-xl transition-all group font-epilogue h-full rounded-2xl">
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 relative shrink-0 bg-muted/30 rounded-xl border border-border/30 p-2 group-hover:border-primary/20 transition-all">
          <Image
            src={logoSrc}
            alt={company}
            fill
            className="object-contain p-1 rounded-lg"
            unoptimized={logoSrc.startsWith("http")}
          />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-3 py-1 text-[10px] font-bold font-epilogue uppercase tracking-wider border border-primary/30 text-primary bg-primary/5 rounded-full">
            {formatEmploymentType(job.employmentType)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold font-clash text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight">
          {job.title}
        </h3>
        <p className="text-muted-foreground text-sm font-medium flex items-center gap-2 flex-wrap">
          <span className="truncate max-w-[12rem]">{company}</span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1 shrink-0">
            <MapPin size={14} className="text-primary" />
            {job.location || job.district || "—"}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {job.salary && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
            <DollarSign size={12} className="text-primary" />
            {job.salary}
          </div>
        )}
        {job.experience && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
            <Briefcase size={12} className="text-primary" />
            {job.experience}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {job.tags?.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 text-[11px] font-bold font-epilogue rounded-full bg-primary/5 text-primary border border-primary/10 uppercase tracking-tight"
          >
            {tag}
          </span>
        ))}
        {job.tags && job.tags.length > 2 && (
          <span className="px-3 py-1 text-[11px] font-bold font-epilogue rounded-full bg-muted/40 text-muted-foreground border border-border/50 uppercase">
            +{job.tags.length - 2}
          </span>
        )}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        <div className="h-px bg-border/50 w-full" />
        <div className="flex items-center justify-between gap-4">
          <Link href={`/jobs/${job.id}`} className="grow">
            <Button className="w-full bg-primary hover:brightness-110 text-white font-bold font-epilogue py-5 shadow-lg shadow-primary/20 cursor-pointer rounded-xl transition-all hover:scale-[1.02] active:scale-95">
              View details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobGridCard;
