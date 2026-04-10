"use client";

import { useMemo } from "react";
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
import { useCreateJob } from "@/hooks/useJob";
import { useGetIndustries } from "@/hooks/useIndustry";
import districts from "@/components/shared/districts";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
const jobSchema = z
  .object({
    industryId: z.string().uuid("Select an industry"),
    subIndustryId: z.string().uuid("Select a sub-industry"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    location: z.string().min(2, "Location is required"),
    district: z.string().optional(),
    salary: z.string().min(1, "Salary range is required"),
    vacancy: z.number().min(1, "Vacancy must be at least 1"),
    age: z.string().max(200).optional(),
    experience: z.string().max(500).optional(),
    /** One requirement per line; sent to API as string[] */
    education: z.string().max(8000).optional(),
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
  });

type JobFormValues = z.infer<typeof jobSchema>;

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateJobModal({
  isOpen,
  onClose,
}: CreateJobModalProps) {
  const queryClient = useQueryClient();
  const { data: industries = [], isLoading: industriesLoading } =
    useGetIndustries();
  const createJobMutation = useCreateJob();

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
    },
  });

  const industryId = watch("industryId");
  const subIndustryId = watch("subIndustryId");

  const subIndustries = useMemo(() => {
    const ind = industries.find((i) => i.id === industryId);
    return ind?.subIndustries ?? [];
  }, [industries, industryId]);

  const onSubmit = async (data: JobFormValues) => {
    const sub = subIndustries.find((s) => s.id === data.subIndustryId);
    if (!sub) {
      toast.error("Pick a sub-industry that belongs to the selected industry");
      return;
    }

    const deadlineIso = `${data.deadline}T23:59:59.000Z`;

    const payload = {
      industryId: data.industryId,
      subIndustryId: data.subIndustryId,
      title: data.title,
      location: data.location,
      district: data.district || undefined,
      salary: data.salary,
      vacancy: data.vacancy,
      age: data.age?.trim() || undefined,
      experience: data.experience?.trim() || undefined,
      education: data.education
        ? data.education
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      jobType: data.jobType,
      employmentType: data.employmentType,
      description: data.description,
      deadline: deadlineIso,
      responsibilities: data.responsibilities
        ? data.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      requiredSkills: data.requiredSkills
        ? data.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      additionalRequirements: data.additionalRequirements
        ? data.additionalRequirements
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      benefits: data.benefits
        ? data.benefits.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      tags: data.tags
        ? data.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      await createJobMutation.mutateAsync(payload);
      toast.success("Job posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["latest-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["featured-jobs"] });
      reset();
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
          : "Failed to post job";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-zinc-200/80 shadow-2xl">
        <div className="bg-linear-to-br from-[#4640DE] via-[#5b54e8] to-[#3530b8] p-8 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: `url('/Pattern.svg')`,
              backgroundSize: "280px",
              backgroundRepeat: "repeat",
            }}
          />
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold font-clash tracking-tight">
                Post a new role
              </DialogTitle>
              <DialogDescription className="text-indigo-100/95 font-epilogue mt-2">
                Company profile is taken from your recruiter account. Candidates
                apply with one click.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-8 bg-linear-to-b from-white to-zinc-50/80"
        >
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash text-[#2D2D2D] border-b border-zinc-200 pb-2">
              Industry & role
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-semibold font-epilogue text-sm text-[#515B6F]">
                  Industry
                </Label>
                <Select
                  disabled={industriesLoading}
                  value={industryId || ""}
                  onValueChange={(v) => {
                    setValue("industryId", v);
                    setValue("subIndustryId", "");
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl border-zinc-200 font-epilogue">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industryId && (
                  <p className="text-xs text-red-500">{errors.industryId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-semibold font-epilogue text-sm text-[#515B6F]">
                  Sub-industry
                </Label>
                <Select
                  disabled={!industryId}
                  value={subIndustryId || ""}
                  onValueChange={(v) => setValue("subIndustryId", v)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-zinc-200 font-epilogue">
                    <SelectValue placeholder="Select sub-industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {subIndustries.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustryId && (
                  <p className="text-xs text-red-500">
                    {errors.subIndustryId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title" className="font-semibold font-epilogue text-sm">
                  Job title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Backend Engineer"
                  {...register("title")}
                  className="h-12 rounded-xl border-zinc-200 font-epilogue"
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash text-[#2D2D2D] border-b border-zinc-200 pb-2">
              Location & compensation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location / city</Label>
                <Input
                  id="location"
                  {...register("location")}
                  className="h-12 rounded-xl border-zinc-200"
                />
                {errors.location && (
                  <p className="text-xs text-red-500">{errors.location.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>District (optional)</Label>
                <Select
                  value={watch("district") || "__none__"}
                  onValueChange={(v) =>
                    setValue("district", v === "__none__" ? "" : v)
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl border-zinc-200">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— None —</SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary range</Label>
                <Input id="salary" {...register("salary")} className="h-12 rounded-xl" />
                {errors.salary && (
                  <p className="text-xs text-red-500">{errors.salary.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vacancy">Openings</Label>
                <Input
                  id="vacancy"
                  type="number"
                  {...register("vacancy", { valueAsNumber: true })}
                  className="h-12 rounded-xl"
                />
                {errors.vacancy && (
                  <p className="text-xs text-red-500">{errors.vacancy.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash text-[#2D2D2D] border-b border-zinc-200 pb-2">
              Candidate requirements
            </h3>
            <p className="text-sm text-[#515B6F] font-epilogue -mt-2">
              Optional details shown to applicants (age range, experience, education
              requirements).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  placeholder="e.g. 25–35 years"
                  {...register("age")}
                  className="h-12 rounded-xl border-zinc-200"
                />
                {errors.age && (
                  <p className="text-xs text-red-500">{errors.age.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  placeholder="e.g. 3+ years in backend"
                  {...register("experience")}
                  className="h-12 rounded-xl border-zinc-200"
                />
                {errors.experience && (
                  <p className="text-xs text-red-500">{errors.experience.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="education">Education requirements (one per line)</Label>
                <Textarea
                  id="education"
                  placeholder={"B.Sc in Computer Science\nMBA preferred\nDiploma in a related field"}
                  {...register("education")}
                  className="min-h-[100px] rounded-xl border-zinc-200 font-epilogue"
                />
                {errors.education && (
                  <p className="text-xs text-red-500">{errors.education.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash border-b border-zinc-200 pb-2">
              Work arrangement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Job type</Label>
                <Select
                  value={watch("jobType")}
                  onValueChange={(v) =>
                    setValue("jobType", v as JobFormValues["jobType"])
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONSITE">On-site</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Employment type</Label>
                <Select
                  value={watch("employmentType")}
                  onValueChange={(v) =>
                    setValue(
                      "employmentType",
                      v as JobFormValues["employmentType"],
                    )
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full-time</SelectItem>
                    <SelectItem value="PART_TIME">Part-time</SelectItem>
                    <SelectItem value="CONTRACTUAL">Contractual</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="deadline">Application deadline</Label>
                <Input id="deadline" type="date" {...register("deadline")} className="h-12 rounded-xl max-w-xs" />
                {errors.deadline && (
                  <p className="text-xs text-red-500">{errors.deadline.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash border-b border-zinc-200 pb-2">
              Description
            </h3>
            <Textarea
              placeholder="What will they do? Team, stack, impact…"
              {...register("description")}
              className="min-h-[120px] rounded-xl"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Responsibilities (one per line)</Label>
                <Textarea {...register("responsibilities")} className="min-h-[100px] rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Required skills (comma-separated)</Label>
                <Input {...register("requiredSkills")} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Additional requirements (one per line)</Label>
                <Textarea {...register("additionalRequirements")} className="min-h-[80px] rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Benefits (one per line)</Label>
                <Textarea {...register("benefits")} className="min-h-[80px] rounded-xl" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Tags (comma-separated)</Label>
                <Input {...register("tags")} placeholder="backend, senior, fintech" className="h-12 rounded-xl" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4 border-t border-zinc-200">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-12">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createJobMutation.isPending}
              className="bg-[#4640DE] hover:bg-[#3b36c0] text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-indigo-200/50"
            >
              {createJobMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Posting…
                </>
              ) : (
                <>
                  <Plus className="mr-2" size={18} />
                  Publish job
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
