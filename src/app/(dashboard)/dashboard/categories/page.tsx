"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetIndustries } from "@/hooks/useIndustry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ChevronRight, Layers, Network, Pencil } from "lucide-react";
import CreateIndustryModal from "@/components/dashboard/CreateIndustryModal";
import CreateSubIndustryModal from "@/components/dashboard/CreateSubIndustryModal";
import { useUpdateIndustry } from "@/hooks/useIndustryMutations";

export default function IndustriesAdminPage() {
  const [industryOpen, setIndustryOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [rename, setRename] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [renameDraft, setRenameDraft] = useState("");
  const [renameLogoFile, setRenameLogoFile] = useState<File | null>(null);
  const updateIndustry = useUpdateIndustry();
  const { data: industries = [], isLoading } = useGetIndustries();

  const saveRename = async () => {
    if (!rename || !renameDraft.trim()) return;
    try {
      await updateIndustry.mutateAsync({
        id: rename.id,
        name: renameDraft.trim(),
        ...(renameLogoFile ? { logoFile: renameLogoFile } : {}),
      });
      setRename(null);
      setRenameLogoFile(null);
    } catch {
      /* toast */
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Taxonomy
          </p>
          <h1 className="font-clash text-4xl font-bold text-zinc-900">
            Industries & sub-industries
          </h1>
          <p className="mt-2 max-w-2xl font-epilogue text-zinc-600">
            Structure used when recruiters post jobs and when candidates filter
            the board. Creating an industry also seeds an &quot;Others&quot;
            sub-industry on the server.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setIndustryOpen(true)}
            className="rounded-xl bg-zinc-900 font-bold text-white hover:bg-zinc-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            New industry
          </Button>
          <Button
            onClick={() => setSubOpen(true)}
            variant="outline"
            className="rounded-xl border-zinc-300 font-bold text-zinc-800 hover:bg-zinc-50"
          >
            <Network className="mr-2 h-4 w-4" />
            New sub-industry
          </Button>
        </div>
      </header>

      <CreateIndustryModal open={industryOpen} onOpenChange={setIndustryOpen} />
      <CreateSubIndustryModal
        open={subOpen}
        onOpenChange={setSubOpen}
        industries={industries}
      />

      <Dialog
        open={!!rename}
        onOpenChange={(o) => {
          if (!o) {
            setRename(null);
            setRenameLogoFile(null);
          }
        }}
      >
        <DialogContent className="border-zinc-200 bg-white text-zinc-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-clash">Edit industry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-zinc-600">Name</Label>
              <Input
                value={renameDraft}
                onChange={(e) => setRenameDraft(e.target.value)}
                className="border-zinc-200 bg-white text-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-600">New logo (optional)</Label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="cursor-pointer border-zinc-200 bg-white text-zinc-900 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium"
                onChange={(e) =>
                  setRenameLogoFile(e.target.files?.[0] ?? null)
                }
              />
              <p className="text-xs text-zinc-500">
                Leave empty to keep the current logo. Max 5MB, JPEG/PNG/WebP/GIF.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="border-zinc-300 text-zinc-800"
              onClick={() => {
                setRename(null);
                setRenameLogoFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-zinc-900 font-bold text-white hover:bg-zinc-800"
              disabled={updateIndustry.isPending}
              onClick={saveRename}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100"
            />
          ))
        ) : industries.length > 0 ? (
          industries.map((industry) => (
            <div
              key={industry.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                    {industry.logo ? (
                      <Image
                        src={industry.logo}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <Layers className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-clash text-xl font-bold text-zinc-900">
                      {industry.name}
                    </h2>
                    <p className="mt-1 font-epilogue text-sm text-zinc-500">
                      {(industry.subIndustries?.length ?? 0)} sub-industries
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                    onClick={() => {
                      setRename({ id: industry.id, name: industry.name });
                      setRenameDraft(industry.name);
                      setRenameLogoFile(null);
                    }}
                    aria-label="Edit industry"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Link
                    href={`/jobs?industryId=${industry.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-epilogue text-sm font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                  >
                    Jobs
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <ul className="max-h-56 space-y-2 overflow-y-auto p-4 md:px-8 md:pb-8">
                {(industry.subIndustries || []).map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2 font-epilogue text-sm text-zinc-700"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    {sub.name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-20 text-center font-epilogue text-zinc-600">
            No industries returned. Seed data or create your first industry.
          </div>
        )}
      </div>
    </div>
  );
}
