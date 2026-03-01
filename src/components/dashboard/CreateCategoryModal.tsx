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
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory } from "@/hooks/useCategory";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const categorySchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
    const queryClient = useQueryClient();
    const createCategoryMutation = useCreateCategory();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            await createCategoryMutation.mutateAsync(data.title);
            toast.success("Category created successfully!");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            reset();
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create category");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 rounded-none border-none shadow-2xl">
                <div className="bg-[#4640DE] p-8 text-white relative overflow-hidden">
                    <div
                        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: `url('/Pattern.svg')`,
                            backgroundSize: '300px',
                            backgroundRepeat: 'repeat'
                        }}
                    />
                    <div className="relative z-10">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold font-clash">Add New Category</DialogTitle>
                            <DialogDescription className="text-indigo-100 font-epilogue mt-2">
                                Create a new job category to help organize postings.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="font-bold font-epilogue text-sm text-[#515B6F]">Category Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Technology, Design, Sales"
                            {...register("title")}
                            className="rounded-none h-12 border-zinc-200 focus:border-[#4640DE] focus:ring-0 font-epilogue"
                        />
                        {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
                    </div>

                    <DialogFooter className="pt-4 border-t border-zinc-100 gap-3">
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
                            disabled={createCategoryMutation.isPending}
                            className="bg-[#4640DE] hover:bg-[#3b36c0] text-white rounded-none h-12 px-8 font-bold font-epilogue shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                            {createCategoryMutation.isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Create Category
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
