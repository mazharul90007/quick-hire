"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdateJob } from "@/hooks/useJob";
import { useGetIndustries } from "@/hooks/useIndustry";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Job } from "@/types";

const jobSchema = z.object({
  industryId: z.string().uuid("Select an industry"),
  subIndustryId: z.string().uuid("Select a sub-industry"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  location: z.string().min(2, "Location is required"),
  district: z.string().optional(),
  salary: z.string().min(1, "Salary range is required"),
  vacancy: z.number().min(1, "Vacancy must be at least 1"),
  jobType: z.enum(["REMOTE", "ONSITE", "HYBRID"]),
  employmentType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACTUAL",
    "INTERNSHIP",
    "FREELANCE",
  ]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z.string().optional(),
  requiredSkills: z.string().optional(),
  additionalRequirements: z.string().optional(),
  benefits: z.string().optional(),
  tags: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"),
  status: z.enum(["ACTIVE", "PAUSED", "DELETED"]),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface UpdateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

function toDateInputValue(deadline?: string | null) {
  if (!deadline) return "";
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function UpdateJobModal({ isOpen, onClose, job }: UpdateJobModalProps) {
  const { data: industries = [] } = useGetIndustries();
  const updateJobMutation = useUpdateJob();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      vacancy: 1,
      jobType: "ONSITE",
      employmentType: "FULL_TIME",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (!job || !isOpen) return;
    reset({
      industryId: job.industryId,
      subIndustryId: job.subIndustryId,
      title: job.title ?? "",
      location: job.location ?? "",
      district: job.district ?? "",
      salary: job.salary ?? "",
      vacancy: job.vacancy ?? 1,
      jobType: job.jobType,
      employmentType: job.employmentType,
      description: job.description ?? "",
      responsibilities: (job.responsibilities ?? []).join("\n"),
      requiredSkills: (job.requiredSkills ?? []).join(", "),
      additionalRequirements: (job.additionalRequirements ?? []).join("\n"),
      benefits: (job.benefits ?? []).join("\n"),
      tags: (job.tags ?? []).join(", "),
      deadline: toDateInputValue(job.deadline),
      status: job.status,
    });
  }, [job, isOpen, reset]);

  const industryId = watch("industryId");
  const subIndustryId = watch("subIndustryId");
  const subIndustries = useMemo(() => {
    const ind = industries.find((i) => i.id === industryId);
    return ind?.subIndustries ?? [];
  }, [industries, industryId]);

  const onSubmit = async (data: JobFormValues) => {
    if (!job) return;
    const sub = subIndustries.find((s) => s.id === data.subIndustryId);
    if (!sub) {
      toast.error("Pick a sub-industry that belongs to the selected industry");
      return;
    }
    const payload = {
      industryId: data.industryId,
      subIndustryId: data.subIndustryId,
      title: data.title,
      location: data.location,
      district: data.district || undefined,
      salary: data.salary,
      vacancy: data.vacancy,
      jobType: data.jobType,
      employmentType: data.employmentType,
      description: data.description,
      status: data.status,
      deadline: `${data.deadline}T23:59:59.000Z`,
      responsibilities: data.responsibilities
        ? data.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      requiredSkills: data.requiredSkills
        ? data.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      additionalRequirements: data.additionalRequirements
        ? data.additionalRequirements.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      benefits: data.benefits
        ? data.benefits.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      tags: data.tags
        ? data.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      await updateJobMutation.mutateAsync({ id: job.id, payload });
      toast.success("Job updated successfully");
      onClose();
    } catch (error: unknown) {
      const msg =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String((error.response.data as { message: string }).message)
          : "Failed to update job";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-clash text-2xl">Update job</DialogTitle>
          <DialogDescription>
            Edit listing details and publish updates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select
                value={industryId || ""}
                onValueChange={(v) => {
                  setValue("industryId", v);
                  setValue("subIndustryId", "");
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id}>{ind.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industryId && <p className="text-xs text-red-500">{errors.industryId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Sub-industry</Label>
              <Select
                disabled={!industryId}
                value={subIndustryId || ""}
                onValueChange={(v) => setValue("subIndustryId", v)}
              >
                <SelectTrigger><SelectValue placeholder="Select sub-industry" /></SelectTrigger>
                <SelectContent>
                  {subIndustries.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subIndustryId && <p className="text-xs text-red-500">{errors.subIndustryId.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Job title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
              {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input id="district" {...register("district")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" {...register("salary")} />
              {errors.salary && <p className="text-xs text-red-500">{errors.salary.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vacancy">Openings</Label>
              <Input id="vacancy" type="number" {...register("vacancy", { valueAsNumber: true })} />
              {errors.vacancy && <p className="text-xs text-red-500">{errors.vacancy.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Job type</Label>
              <Select value={watch("jobType")} onValueChange={(v) => setValue("jobType", v as JobFormValues["jobType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONSITE">On-site</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Employment type</Label>
              <Select value={watch("employmentType")} onValueChange={(v) => setValue("employmentType", v as JobFormValues["employmentType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full-time</SelectItem>
                  <SelectItem value="PART_TIME">Part-time</SelectItem>
                  <SelectItem value="CONTRACTUAL">Contractual</SelectItem>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  <SelectItem value="FREELANCE">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Job status</Label>
              <Select value={watch("status")} onValueChange={(v) => setValue("status", v as JobFormValues["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" {...register("deadline")} />
              {errors.deadline && <p className="text-xs text-red-500">{errors.deadline.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} className="min-h-[120px]" />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Responsibilities (one per line)</Label>
              <Textarea {...register("responsibilities")} />
            </div>
            <div className="space-y-2">
              <Label>Required skills (comma-separated)</Label>
              <Input {...register("requiredSkills")} />
            </div>
            <div className="space-y-2">
              <Label>Additional requirements (one per line)</Label>
              <Textarea {...register("additionalRequirements")} />
            </div>
            <div className="space-y-2">
              <Label>Benefits (one per line)</Label>
              <Textarea {...register("benefits")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Tags (comma-separated)</Label>
              <Input {...register("tags")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateJobMutation.isPending}>
              {updateJobMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
