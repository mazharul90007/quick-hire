"use client";

import { useState } from "react";
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
import { useGetAllCategories } from "@/hooks/useCategory";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  companyName: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  salary: z.string().min(1, "Salary range is required"),
  vacancy: z.number().min(1, "Vacancy must be at least 1"),
  jobType: z.enum(["REMOTE", "IN_PERSON", "HYBRID"]),
  employmentType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
    "TEMPORARY",
  ]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z.string().optional(),
  requiredSkills: z.string().optional(),
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
  const { data: categories } = useGetAllCategories();
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
      jobType: "IN_PERSON",
      employmentType: "FULL_TIME",
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      // Format arrays for the backend
      const payload = {
        ...data,
        responsibilities: data.responsibilities
          ? data.responsibilities.split("\n").filter((i) => i.trim() !== "")
          : [],
        requiredSkills: data.requiredSkills
          ? data.requiredSkills
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i !== "")
          : [],
        additionalReqirements: [], // Default empty for now
        benefits: [], // Default empty for now
        tags: [], // Default empty for now
      };

      await createJobMutation.mutateAsync(payload);
      toast.success("Job posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["latest-jobs"] });
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to post job");
    }
  };

  const selectedJobType = watch("jobType");
  const selectedEmpType = watch("employmentType");
  const selectedCategory = watch("categoryId");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-w-4xl! max-h-[90vh] overflow-y-auto p-0 rounded-none border-none shadow-2xl">
        <div className="bg-[#4640DE] p-8 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url('/Pattern.svg')`,
              backgroundSize: "300px",
              backgroundRepeat: "repeat",
            }}
          />
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold font-clash">
                Post a New Job
              </DialogTitle>
              <DialogDescription className="text-indigo-100 font-epilogue mt-2">
                Fill in the details below to create a professional job listing.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-8 bg-white"
        >
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash text-[#2D2D2D] border-b border-zinc-100 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="font-bold font-epilogue text-sm text-[#515B6F]"
                >
                  Job Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Software Engineer"
                  {...register("title")}
                  className="rounded-none h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-bold font-epilogue text-sm text-[#515B6F]">
                  Category
                </Label>
                <Select
                  onValueChange={(value) => setValue("categoryId", value)}
                  defaultValue={selectedCategory}
                >
                  <SelectTrigger className="rounded-none h-12 border-zinc-200 focus:ring-0 font-epilogue">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-zinc-100 shadow-xl">
                    {categories?.map((cat: any) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="font-epilogue"
                      >
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Company & Location */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash text-[#2D2D2D] border-b border-zinc-100 pb-2">
              Company & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="font-bold font-epilogue text-sm text-[#515B6F]"
                >
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  placeholder="e.g. TechCorp"
                  {...register("companyName")}
                  className="rounded-none h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
                />
                {errors.companyName && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="font-bold font-epilogue text-sm text-[#515B6F]"
                >
                  Location / City
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  {...register("location")}
                  className="rounded-none h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
                />
                {errors.location && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Job Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash text-[#2D2D2D] border-b border-zinc-100 pb-2">
              Job Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="font-bold font-epilogue text-sm text-[#515B6F]">
                  Job Type
                </Label>
                <Select
                  onValueChange={(value: any) => setValue("jobType", value)}
                  defaultValue={selectedJobType}
                >
                  <SelectTrigger className="rounded-none h-12 border-zinc-200 focus:ring-0 font-epilogue">
                    <SelectValue placeholder="Select Job Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-zinc-100 shadow-xl">
                    <SelectItem value="IN_PERSON" className="font-epilogue">
                      In Person
                    </SelectItem>
                    <SelectItem value="REMOTE" className="font-epilogue">
                      Remote
                    </SelectItem>
                    <SelectItem value="HYBRID" className="font-epilogue">
                      Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold font-epilogue text-sm text-[#515B6F]">
                  Employment Type
                </Label>
                <Select
                  onValueChange={(value: any) =>
                    setValue("employmentType", value)
                  }
                  defaultValue={selectedEmpType}
                >
                  <SelectTrigger className="rounded-none h-12 border-zinc-200 focus:ring-0 font-epilogue">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-zinc-100 shadow-xl">
                    <SelectItem value="FULL_TIME" className="font-epilogue">
                      Full Time
                    </SelectItem>
                    <SelectItem value="PART_TIME" className="font-epilogue">
                      Part Time
                    </SelectItem>
                    <SelectItem value="CONTRACT" className="font-epilogue">
                      Contract
                    </SelectItem>
                    <SelectItem value="INTERNSHIP" className="font-epilogue">
                      Internship
                    </SelectItem>
                    <SelectItem value="TEMPORARY" className="font-epilogue">
                      Temporary
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="salary"
                  className="font-bold font-epilogue text-sm text-[#515B6F]"
                >
                  Salary Range
                </Label>
                <Input
                  id="salary"
                  placeholder="e.g. $80k - $120k"
                  {...register("salary")}
                  className="rounded-none h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
                />
                {errors.salary && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.salary.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="vacancy"
                  className="font-bold font-epilogue text-sm text-[#515B6F]"
                >
                  Vacancy
                </Label>
                <Input
                  id="vacancy"
                  type="number"
                  {...register("vacancy", { valueAsNumber: true })}
                  className="rounded-none h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
                />
                {errors.vacancy && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.vacancy.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="deadline"
                  className="font-bold font-epilogue text-sm text-[#515B6F]"
                >
                  Application Deadline
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  {...register("deadline")}
                  className="rounded-none h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
                />
                {errors.deadline && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.deadline.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Content */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-clash text-[#2D2D2D] border-b border-zinc-100 pb-2">
              Description & Requirements
            </h3>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="font-bold font-epilogue text-sm text-[#515B6F]"
              >
                Job Description
              </Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the role..."
                {...register("description")}
                className="rounded-none min-h-[120px] border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="responsibilities"
                className="font-bold font-epilogue text-sm text-[#515B6F]"
              >
                Responsibilities (One per line)
              </Label>
              <Textarea
                id="responsibilities"
                placeholder="e.g. Build new features&#10;Manage team..."
                {...register("responsibilities")}
                className="rounded-none min-h-[100px] border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="requiredSkills"
                className="font-bold font-epilogue text-sm text-[#515B6F]"
              >
                Skills (Comma separated)
              </Label>
              <Input
                id="requiredSkills"
                placeholder="React, TypeScript, Node.js..."
                {...register("requiredSkills")}
                className="rounded-none h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
              />
            </div>
          </div>

          <DialogFooter className="pt-8 border-t border-zinc-100 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-none h-12 px-8 font-bold font-epilogue"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createJobMutation.isPending}
              className="bg-[#4640DE] hover:bg-[#3b36c0] text-white rounded-none h-12 px-8 font-bold font-epilogue shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              {createJobMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Posting...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Post Job
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
