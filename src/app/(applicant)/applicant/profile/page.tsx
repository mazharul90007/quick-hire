"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useApplicantProfile,
  useUpdateApplicantProfile,
} from "@/hooks/useApplicantProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Loader2, Mail, MapPin, Phone, User } from "lucide-react";

type FormValues = {
  name: string;
  address: string;
  phone: string;
};

export default function ApplicantProfilePage() {
  const { data: profile, isLoading } = useApplicantProfile();
  const update = useUpdateApplicantProfile();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: "", address: "", phone: "" },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      name: profile.name ?? profile.user?.name ?? "",
      address: profile.address ?? profile.user?.address ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile, reset]);

  const onSubmit = (values: FormValues) => {
    const imageEl = document.getElementById(
      "applicant-photo",
    ) as HTMLInputElement | null;
    const cvEl = document.getElementById("applicant-cv") as HTMLInputElement | null;
    const image = imageEl?.files?.[0];
    const cv = cvEl?.files?.[0];

    update.mutate(
      {
        data: {
          name: values.name.trim() || undefined,
          address: values.address.trim() || undefined,
          phone: values.phone.trim() || undefined,
        },
        files: {
          ...(image ? { image } : {}),
          ...(cv ? { cv } : {}),
        },
      },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          if (imageEl) imageEl.value = "";
          if (cvEl) cvEl.value = "";
        },
        onError: (e: Error) => toast.error(e.message || "Update failed"),
      },
    );
  };

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  const displayName = profile.name ?? profile.user?.name ?? "Applicant";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="border-b border-border pb-7">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Profile
        </p>
        <h1 className="mt-2 font-clash text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Applicant profile
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Keep your profile complete and up to date. Recruiters see this data
          when you apply to jobs.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-4">
          <div className="flex items-start gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-lg font-semibold text-muted-foreground">
              {profile.user.image ? (
                <Image
                  src={profile.user.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                initials || <User className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-clash text-xl font-semibold text-foreground">
                {displayName}
              </p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{profile.user.email}</span>
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-4 border-t border-border pt-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Address
                </dt>
                <dd className="text-sm text-foreground">
                  {profile.address || profile.user.address || "Not provided"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Phone
                </dt>
                <dd className="text-sm text-foreground">
                  {profile.phone || "Not provided"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Resume
                </dt>
                <dd className="text-sm text-foreground">
                  {profile.cv ? "CV uploaded" : "No CV uploaded"}
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-8 md:p-8">
          <h2 className="font-clash text-xl font-semibold text-foreground">
            Edit details
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes are saved to your applicant account immediately.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display name</Label>
                <Input id="name" {...register("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="applicant-photo">Profile photo</Label>
                <Input
                  id="applicant-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
                />
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP, or GIF. Max 5MB.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicant-cv">Resume (PDF)</Label>
                <Input
                  id="applicant-cv"
                  type="file"
                  accept="application/pdf"
                  className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
                />
                {profile.cv ? (
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-medium text-primary hover:underline"
                  >
                    View current CV
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No CV on file yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-border pt-4">
              <Button type="submit" disabled={update.isPending} className="min-w-36">
                {update.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
