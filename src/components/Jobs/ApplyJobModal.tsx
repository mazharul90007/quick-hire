"use client";

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

const applicationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    resume_link: z.string().url("Please enter a valid URL for your resume"),
    expectedSalary: z.string().min(1, "Expected salary is required"),
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
        values: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            resume_link: "",
            expectedSalary: "",
            cover_note: "",
        },
    });

    const onSubmit = async (data: ApplicationFormValues) => {
        try {
            await createApplicationMutation.mutateAsync({
                ...data,
                jobId,
                userId: session?.user?.id,
            });

            Swal.fire({
                title: "Success!",
                text: "Your application has been submitted successfully.",
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
        } catch (error: any) {
            Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message || "Something went wrong. Please try again.",
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <div className="bg-[#4640DE] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 text-center">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold font-clash leading-tight text-center">
                                Apply for {jobTitle}
                            </DialogTitle>
                            <DialogDescription className="text-indigo-100 font-epilogue mt-2 text-center">
                                Submit your application and take the next step in your career.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-bold text-[#2D2D2D] font-epilogue text-sm">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter your full name"
                                {...register("name")}
                                className="h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 rounded-xl font-epilogue"
                            />
                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold text-[#2D2D2D] font-epilogue text-sm">Email Address</Label>
                            <Input
                                id="email"
                                placeholder="email@example.com"
                                {...register("email")}
                                className="h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 rounded-xl font-epilogue"
                            />
                            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="resume_link" className="font-bold text-[#2D2D2D] font-epilogue text-sm">Resume Link</Label>
                            <Input
                                id="resume_link"
                                placeholder="https://google.com/drive/..."
                                {...register("resume_link")}
                                className="h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 rounded-xl font-epilogue"
                            />
                            {errors.resume_link && <p className="text-xs text-red-500 font-medium">{errors.resume_link.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expectedSalary" className="font-bold text-[#2D2D2D] font-epilogue text-sm">Expected Salary</Label>
                            <Input
                                id="expectedSalary"
                                placeholder="e.g. 50,000 BDT"
                                {...register("expectedSalary")}
                                className="h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 rounded-xl font-epilogue"
                            />
                            {errors.expectedSalary && <p className="text-xs text-red-500 font-medium">{errors.expectedSalary.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cover_note" className="font-bold text-[#2D2D2D] font-epilogue text-sm">Cover Note (Optional)</Label>
                        <Textarea
                            id="cover_note"
                            placeholder="Tell us why you're a good fit for this role..."
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
                                "Submit Application"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ApplyJobModal;
