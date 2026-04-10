"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRecruiterProfile, useUpdateRecruiterProfile } from "@/hooks/useRecruiterProfile";
import { useGetIndustries } from "@/hooks/useIndustry";
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
import { toast } from "sonner";
import {
  BadgeCheck,
  Building2,
  Globe,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";

const COMPANY_SIZES = [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "VERY_LARGE",
  "ENTERPRISE",
] as const;

type FormValues = {
  recruiterName: string;
  recruiterPhone: string;
  recruiterWorkEmail: string;
  companyName: string;
  companyWebsite: string;
  companyFacebookId: string;
  companyLinkedInId: string;
  companyAddress: string;
  companySize: string;
  industryId: string;
  subIndustryId: string;
};

export default function RecruiterProfilePage() {
  const { data: profile, isLoading } = useRecruiterProfile();
  const { data: industries = [] } = useGetIndustries();
  const update = useUpdateRecruiterProfile();

  const { register, handleSubmit, reset, control, setValue } =
    useForm<FormValues>({
      defaultValues: {
        recruiterName: "",
        recruiterPhone: "",
        recruiterWorkEmail: "",
        companyName: "",
        companyWebsite: "",
        companyFacebookId: "",
        companyLinkedInId: "",
        companyAddress: "",
        companySize: "",
        industryId: "",
        subIndustryId: "",
      },
    });

  const industryId = useWatch({ control, name: "industryId" });
  const subIndustryIdW = useWatch({ control, name: "subIndustryId" });
  const companySizeW = useWatch({ control, name: "companySize" });

  const subIndustries = useMemo(() => {
    const ind = industries.find((i) => i.id === industryId);
    return ind?.subIndustries ?? [];
  }, [industries, industryId]);

  useEffect(() => {
    if (!profile) return;
    reset({
      recruiterName: profile.recruiterName ?? "",
      recruiterPhone: profile.recruiterPhone ?? "",
      recruiterWorkEmail: profile.recruiterWorkEmail ?? "",
      companyName: profile.companyName ?? "",
      companyWebsite: profile.companyWebsite ?? "",
      companyFacebookId: profile.companyFacebookId ?? "",
      companyLinkedInId: profile.companyLinkedInId ?? "",
      companyAddress: profile.companyAddress ?? "",
      companySize: profile.companySize ?? "",
      industryId: profile.industryId ?? "",
      subIndustryId: profile.subIndustryId ?? "",
    });
  }, [profile, reset]);

  const onSubmit = (values: FormValues) => {
    const imageEl = document.getElementById(
      "recruiter-photo",
    ) as HTMLInputElement | null;
    const logoEl = document.getElementById(
      "company-logo",
    ) as HTMLInputElement | null;
    const image = imageEl?.files?.[0];
    const logo = logoEl?.files?.[0];

    const data: Record<string, unknown> = {
      recruiterName: values.recruiterName.trim() || undefined,
      recruiterPhone: values.recruiterPhone.trim() || undefined,
      recruiterWorkEmail: values.recruiterWorkEmail.trim() || undefined,
      companyName: values.companyName.trim() || undefined,
      companyWebsite: values.companyWebsite.trim() || undefined,
      companyFacebookId: values.companyFacebookId.trim() || undefined,
      companyLinkedInId: values.companyLinkedInId.trim() || undefined,
      companyAddress: values.companyAddress.trim() || undefined,
      companySize: values.companySize || undefined,
      industryId: values.industryId ? values.industryId : null,
      subIndustryId: values.subIndustryId ? values.subIndustryId : null,
    };

    update.mutate(
      {
        data,
        files: {
          ...(image ? { image } : {}),
          ...(logo ? { companyLogo: logo } : {}),
        },
      },
      {
        onSuccess: () => {
          toast.success("Company profile updated");
          if (imageEl) imageEl.value = "";
          if (logoEl) logoEl.value = "";
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

  const displayName = profile.recruiterName || profile.user.name || "Recruiter";
  const companyName = profile.companyName || "Company profile";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="border-b border-border pb-7">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Organization
        </p>
        <h1 className="mt-2 font-clash text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Company profile
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Keep your recruiter and company information up to date for better trust
          and visibility across QuickHire.
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
              <p className="mt-1 text-sm text-muted-foreground">{companyName}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
                  {profile.subscriptionPlan}
                </span>
                <span
                  className={
                    profile.isVerified
                      ? "inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800"
                      : "inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-800"
                  }
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {profile.isVerified ? "Verified company" : "Verification pending"}
                </span>
              </div>
            </div>
          </div>

          <dl className="mt-6 space-y-4 border-t border-border pt-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Login email
                </dt>
                <dd className="truncate text-sm text-foreground">
                  {profile.user.email}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Recruiter phone
                </dt>
                <dd className="truncate text-sm text-foreground">
                  {profile.recruiterPhone || "Not set"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Website
                </dt>
                <dd className="truncate text-sm text-foreground">
                  {profile.companyWebsite || "Not set"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Industry
                </dt>
                <dd className="truncate text-sm text-foreground">
                  {profile.industry?.name || "Not selected"}
                  {profile.subIndustry?.name
                    ? ` • ${profile.subIndustry.name}`
                    : ""}
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-8 md:p-8"
        >
          <div>
            <h2 className="font-clash text-xl font-semibold text-foreground">
              Edit company details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These details appear in your recruiter profile and job listings.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="recruiterName">Recruiter name</Label>
              <Input id="recruiterName" {...register("recruiterName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recruiterPhone">Phone</Label>
              <Input id="recruiterPhone" {...register("recruiterPhone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recruiterWorkEmail">Work email</Label>
              <Input
                id="recruiterWorkEmail"
                type="email"
                {...register("recruiterWorkEmail")}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input id="companyName" {...register("companyName")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="companyWebsite">Website</Label>
              <Input id="companyWebsite" {...register("companyWebsite")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="companyAddress">Address</Label>
              <Input id="companyAddress" {...register("companyAddress")} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select
                value={industryId || "__none__"}
                onValueChange={(v) => {
                  setValue("industryId", v === "__none__" ? "" : v);
                  setValue("subIndustryId", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {industries.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sub-industry</Label>
              <Select
                value={subIndustryIdW || "__none__"}
                onValueChange={(v) =>
                  setValue("subIndustryId", v === "__none__" ? "" : v)
                }
                disabled={!industryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {subIndustries.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Company size</Label>
              <Select
                value={companySizeW || "__none__"}
                onValueChange={(v) =>
                  setValue("companySize", v === "__none__" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {COMPANY_SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyFacebookId">Facebook</Label>
              <Input id="companyFacebookId" {...register("companyFacebookId")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyLinkedInId">LinkedIn</Label>
              <Input id="companyLinkedInId" {...register("companyLinkedInId")} />
            </div>
          </div>

          <div className="grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recruiter-photo">Your photo</Label>
              <Input
                id="recruiter-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
              />
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, or GIF. Max 5MB.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-logo">Company logo</Label>
              <Input
                id="company-logo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
              />
              <p className="text-xs text-muted-foreground">
                Used on job cards and company profile.
              </p>
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
      </div>
    </div>
  );
}
