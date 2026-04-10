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
import { Label } from "@/components/ui/label";
import { useCreateIndustry } from "@/hooks/useIndustryMutations";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateIndustryModal({ open, onOpenChange }: Props) {
  const mutation = useCreateIndustry();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    if (!logoFile || logoFile.size === 0) {
      setLogoError("Industry logo image is required");
      return;
    }
    setLogoError(null);
    mutation.mutate(
      { name: data.name, logo: logoFile },
      {
        onSuccess: () => {
          reset();
          setLogoFile(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setLogoFile(null);
          setLogoError(null);
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="border-zinc-200 bg-white text-zinc-900 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-clash text-xl">New industry</DialogTitle>
          <DialogDescription className="font-epilogue text-zinc-600">
            Creates an industry and a default &quot;Others&quot; sub-industry on
            the server. A logo image is required (JPEG, PNG, WebP, or GIF).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ind-name" className="text-zinc-700">
              Name
            </Label>
            <Input
              id="ind-name"
              {...register("name")}
              className="border-zinc-200 bg-white text-zinc-900"
              placeholder="e.g. Healthcare"
            />
            {errors.name && (
              <p className="text-xs text-rose-600">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ind-logo" className="text-zinc-700">
              Logo
            </Label>
            <Input
              id="ind-logo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="cursor-pointer border-zinc-200 bg-white text-zinc-900 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setLogoFile(f);
                setLogoError(null);
              }}
            />
            {logoError && (
              <p className="text-xs text-rose-600">{logoError}</p>
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
