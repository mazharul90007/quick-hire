"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateApplication } from "@/hooks/useApplication";
import { authClient } from "@/lib/auth-client";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const applicationSchema = z.object({
  expectedSalary: z.string().optional(),
  cover_note: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

const ApplyJobModal = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}: ApplyJobModalProps) => {
  const { data: session } = authClient.useSession();
  const createApplicationMutation = useCreateApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      expectedSalary: "",
      cover_note: "",
    },
  });

  const cvInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: ApplicationFormValues) => {
    const file = cvInputRef.current?.files?.[0];
    if (!file) {
      Swal.fire({
        title: "CV required",
        text: "Please upload your CV as a PDF (max 5 MB).",
        icon: "warning",
        confirmButtonColor: "#4640DE",
      });
      return;
    }
    if (file.type !== "application/pdf") {
      Swal.fire({
        title: "Invalid file",
        text: "Only PDF files are accepted.",
        icon: "error",
        confirmButtonColor: "#4640DE",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "File too large",
        text: "Maximum CV size is 5 MB.",
        icon: "error",
        confirmButtonColor: "#4640DE",
      });
      return;
    }

    try {
      await createApplicationMutation.mutateAsync({
        jobId,
        cv: file,
        cover_note: data.cover_note || undefined,
        expectedSalary: data.expectedSalary || undefined,
      });

      Swal.fire({
        title: "Success!",
        text: "Your application has been submitted.",
        icon: "success",
        confirmButtonColor: "#4640DE",
        customClass: {
          popup: "rounded-2xl font-epilogue",
          title: "font-clash",
          confirmButton: "rounded-xl px-8 py-3 font-bold",
        },
      });

      onClose();
      reset();
      if (cvInputRef.current) cvInputRef.current.value = "";
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
          : "Something went wrong. Please try again.";
      Swal.fire({
        title: "Could not apply",
        text: msg,
        icon: "error",
        confirmButtonColor: "#4640DE",
        customClass: {
          popup: "rounded-2xl font-epilogue",
          title: "font-clash",
          confirmButton: "rounded-xl px-8 py-3 font-bold",
        },
      });
    }
  };

  const user = session?.user;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <div className="bg-gradient-to-br from-[#4640DE] to-[#3530b8] p-8 text-white relative overflow-hidden">
          <div className="relative z-10 text-center">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold font-clash leading-tight text-center text-white">
                Apply for {jobTitle}
              </DialogTitle>
              <DialogDescription className="text-indigo-100 font-epilogue mt-2 text-center">
                Upload a PDF CV (max 5 MB). Your profile comes from your
                account; optional note and salary expectation below.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {!user ? (
          <div className="p-10 space-y-6 bg-white text-center">
            <p className="text-[#515B6F] font-epilogue">
              Sign in as an applicant to submit applications through QuickHire.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-[#4640DE] hover:bg-[#3b36c0] rounded-xl h-12 font-bold"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="outline" onClick={onClose} className="rounded-xl h-12 font-bold">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 space-y-6 bg-white"
          >
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-left">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Applying as
              </p>
              <p className="font-bold text-[#2D2D2D] font-epilogue">
                {user.name || "Applicant"}
              </p>
              <p className="text-sm text-[#515B6F] font-epilogue">
                {user.email}
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cv"
                className="font-bold text-[#2D2D2D] font-epilogue text-sm"
              >
                CV (PDF, required)
              </Label>
              <input
                id="cv"
                ref={cvInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-epilogue cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#4640DE] focus-visible:border-[#4640DE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4640DE]/25"
              />
              <p className="text-xs text-zinc-500 font-epilogue">
                Stored securely on Cloudinary; only a link is saved with your
                application.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="expectedSalary"
                className="font-bold text-[#2D2D2D] font-epilogue text-sm"
              >
                Expected salary (optional)
              </Label>
              <Input
                id="expectedSalary"
                placeholder="e.g. 80,000 BDT / year"
                {...register("expectedSalary")}
                className="h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 rounded-xl font-epilogue"
              />
              {errors.expectedSalary && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.expectedSalary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cover_note"
                className="font-bold text-[#2D2D2D] font-epilogue text-sm"
              >
                Cover note (optional)
              </Label>
              <Textarea
                id="cover_note"
                placeholder="Why you’re a great fit…"
                {...register("cover_note")}
                className="min-h-[120px] border-zinc-200 focus:border-[#4640DE] focus:ring-0 rounded-xl resize-none p-4 font-epilogue"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 rounded-xl font-bold font-epilogue border-zinc-200 hover:bg-zinc-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createApplicationMutation.isPending}
                className="flex-[2] bg-[#4640DE] hover:bg-[#3b36c0] text-white font-bold font-epilogue h-14 text-lg shadow-xl shadow-indigo-500/20 rounded-xl cursor-pointer"
              >
                {createApplicationMutation.isPending ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Submit application"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobModal;
