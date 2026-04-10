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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSubIndustry } from "@/hooks/useIndustryMutations";
import type { Industry } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const schema = z.object({
  industryId: z.string().uuid("Select an industry"),
  name: z.string().min(2, "Name is too short"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industries: Industry[];
}

export default function CreateSubIndustryModal({
  open,
  onOpenChange,
  industries,
}: Props) {
  const mutation = useCreateSubIndustry();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const industryId = watch("industryId");

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (data: FormValues) => {
    mutation.mutate(
      { name: data.name, industryId: data.industryId },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-200 bg-white text-zinc-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-clash text-xl">New sub-industry</DialogTitle>
          <DialogDescription className="font-epilogue text-zinc-600">
            Attach a specialization under an existing industry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-700">Industry</Label>
            <Select
              value={industryId || ""}
              onValueChange={(v) => setValue("industryId", v)}
            >
              <SelectTrigger className="border-zinc-200 bg-white text-zinc-900">
                <SelectValue placeholder="Choose parent industry" />
              </SelectTrigger>
              <SelectContent className="border-zinc-200 bg-white">
                {industries.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industryId && (
              <p className="text-xs text-rose-600">{errors.industryId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-name" className="text-zinc-700">
              Sub-industry name
            </Label>
            <Input
              id="sub-name"
              {...register("name")}
              className="border-zinc-200 bg-white text-zinc-900"
              placeholder="e.g. Pediatrics"
            />
            {errors.name && (
              <p className="text-xs text-rose-600">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              className="text-zinc-600"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-zinc-900 text-white hover:bg-zinc-800"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
