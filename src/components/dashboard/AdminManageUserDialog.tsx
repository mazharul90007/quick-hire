"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAdminEntityDetail,
  usePatchAdminApplicant,
  usePatchAdminRecruiter,
  usePatchAdminStaffProfile,
  useSoftDeleteUser,
  useUpdateUserStatus,
  type AdminEntityKind,
} from "@/hooks/useAdmin";
import type {
  AdminApplicantRow,
  AdminRecruiterRow,
  AdminStaffRow,
  AdminUserPublic,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetIndustries } from "@/hooks/useIndustry";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ACCOUNT_STATUSES = ["ACTIVE", "BLOCKED"] as const;
const APPLICANT_USER_TYPES = ["NORMAL", "SILVER", "GOLD", "DIAMOND"] as const;
const SUBSCRIPTION_PLANS = ["FREE", "SILVER", "GOLD", "DIAMOND"] as const;
const COMPANY_SIZES = [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "VERY_LARGE",
  "ENTERPRISE",
] as const;

export type AdminManageContext = {
  kind: AdminEntityKind;
  profileId: string;
  user: AdminUserPublic;
  title: string;
};

function canManageTarget(actorRole: string, target: AdminUserPublic): boolean {
  if (target.role === "SUPER_ADMIN" && actorRole !== "SUPER_ADMIN") {
    return false;
  }
  return true;
}

function roleLabel(role: string): string {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusLabel(status: string): string {
  if (status === "ACTIVE") return "Active";
  if (status === "BLOCKED") return "Blocked";
  if (status === "DELETED") return "Deleted";
  return status;
}

const fieldClass =
  "h-9 rounded-md border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-400";
const selectTriggerClass =
  "h-9 rounded-md border-zinc-200 bg-white text-sm text-zinc-900 focus:ring-zinc-400";
const selectContentClass = "border-zinc-200 bg-white text-zinc-900";

export function AdminManageUserDialog({
  open,
  onOpenChange,
  context,
  actorRole,
  actorUserId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  context: AdminManageContext | null;
  actorRole: string;
  actorUserId: string;
}) {
  const user = context?.user ?? null;
  const kind = context?.kind ?? null;
  const profileId = context?.profileId ?? null;

  const detailQ = useAdminEntityDetail(kind, profileId, open);
  const detail = detailQ.data;

  const patchApplicant = usePatchAdminApplicant();
  const patchRecruiter = usePatchAdminRecruiter();
  const patchStaff = usePatchAdminStaffProfile();
  const updateStatus = useUpdateUserStatus();
  const softDelete = useSoftDeleteUser();

  const { data: industries = [] } = useGetIndustries();

  const [statusDraft, setStatusDraft] = useState("ACTIVE");

  const [aName, setAName] = useState("");
  const [aAddress, setAAddress] = useState("");
  const [aPhone, setAPhone] = useState("");
  const [aUserType, setAUserType] = useState("NORMAL");
  const [aImage, setAImage] = useState<File | null>(null);
  const [aCv, setACv] = useState<File | null>(null);

  const [rName, setRName] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rWorkEmail, setRWorkEmail] = useState("");
  const [rCompany, setRCompany] = useState("");
  const [rWebsite, setRWebsite] = useState("");
  const [rAddress, setRAddress] = useState("");
  const [rFb, setRFb] = useState("");
  const [rLi, setRLi] = useState("");
  const [rSize, setRSize] = useState("");
  const [rIndustry, setRIndustry] = useState("");
  const [rSub, setRSub] = useState("");
  const [rVerified, setRVerified] = useState(false);
  const [rPlan, setRPlan] = useState("FREE");
  const [rImage, setRImage] = useState<File | null>(null);
  const [rLogo, setRLogo] = useState<File | null>(null);

  const [sName, setSName] = useState("");
  const [sAddress, setSAddress] = useState("");
  const [sPhone, setSPhone] = useState("");
  const [sImage, setSImage] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    const s = user.status;
    setStatusDraft(
      ACCOUNT_STATUSES.includes(s as (typeof ACCOUNT_STATUSES)[number])
        ? s
        : "ACTIVE",
    );
  }, [user]);

  useEffect(() => {
    if (!detail || !kind) return;
    if (kind === "applicant") {
      const d = detail as AdminApplicantRow;
      setAName(d.name ?? "");
      setAAddress(d.address ?? "");
      setAPhone(d.phone ?? "");
      setAUserType(d.userType ?? "NORMAL");
      setAImage(null);
      setACv(null);
    } else if (kind === "recruiter") {
      const d = detail as AdminRecruiterRow;
      setRName(d.recruiterName ?? "");
      setRPhone(d.recruiterPhone ?? "");
      setRWorkEmail(d.recruiterWorkEmail ?? "");
      setRCompany(d.companyName ?? "");
      setRWebsite(d.companyWebsite ?? "");
      setRAddress(d.companyAddress ?? "");
      setRFb(d.companyFacebookId ?? "");
      setRLi(d.companyLinkedInId ?? "");
      setRSize(d.companySize ?? "");
      setRIndustry(d.industryId ?? "");
      setRSub(d.subIndustryId ?? "");
      setRVerified(!!d.isVerified);
      setRPlan(d.subscriptionPlan ?? "FREE");
      setRImage(null);
      setRLogo(null);
    } else {
      const d = detail as AdminStaffRow;
      setSName(d.name ?? "");
      setSAddress(d.address ?? "");
      setSPhone(d.phone ?? "");
      setSImage(null);
    }
  }, [detail, kind]);

  const subIndustries = useMemo(() => {
    const ind = industries.find((i) => i.id === rIndustry);
    return ind?.subIndustries ?? [];
  }, [industries, rIndustry]);

  const isSelf = user ? user.id === actorUserId : false;
  const canManage = user ? canManageTarget(actorRole, user) : false;
  const locked = user ? user.isDeleted || !canManage : true;
  const busy =
    updateStatus.isPending ||
    softDelete.isPending ||
    patchApplicant.isPending ||
    patchRecruiter.isPending ||
    patchStaff.isPending;

  async function saveApplicantProfile() {
    if (!profileId) return;
    const payload: Record<string, unknown> = {};
    if (aName.trim()) payload.name = aName.trim();
    if (aAddress.trim()) payload.address = aAddress.trim();
    if (aPhone.trim()) payload.phone = aPhone.trim();
    if (aUserType) payload.userType = aUserType;
    await patchApplicant.mutateAsync({
      id: profileId,
      payload,
      files: { image: aImage ?? undefined, cv: aCv ?? undefined },
    });
    setAImage(null);
    setACv(null);
    detailQ.refetch();
  }

  async function saveRecruiterProfile() {
    if (!profileId) return;
    const payload: Record<string, unknown> = {
      recruiterName: rName.trim() || undefined,
      recruiterPhone: rPhone.trim() || undefined,
      recruiterWorkEmail: rWorkEmail.trim() || undefined,
      companyName: rCompany.trim() || undefined,
      companyWebsite: rWebsite.trim() || undefined,
      companyAddress: rAddress.trim() || undefined,
      companyFacebookId: rFb.trim() || undefined,
      companyLinkedInId: rLi.trim() || undefined,
      isVerified: rVerified,
      subscriptionPlan: rPlan,
    };
    if (rSize && COMPANY_SIZES.includes(rSize as (typeof COMPANY_SIZES)[number])) {
      payload.companySize = rSize;
    }
    payload.industryId = rIndustry.trim() ? rIndustry : null;
    payload.subIndustryId = rSub.trim() ? rSub : null;
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });
    await patchRecruiter.mutateAsync({
      id: profileId,
      payload,
      files: { image: rImage ?? undefined, companyLogo: rLogo ?? undefined },
    });
    setRImage(null);
    setRLogo(null);
    detailQ.refetch();
  }

  async function saveStaffProfile() {
    if (!profileId) return;
    const payload: Record<string, unknown> = {};
    if (sName.trim()) payload.name = sName.trim();
    if (sAddress.trim()) payload.address = sAddress.trim();
    if (sPhone.trim()) payload.phone = sPhone.trim();
    await patchStaff.mutateAsync({
      id: profileId,
      payload,
      files: { image: sImage ?? undefined },
    });
    setSImage(null);
    detailQ.refetch();
  }

  function copyAccountReference() {
    if (!user) return;
    void navigator.clipboard.writeText(user.id);
    toast.success("Account reference copied", {
      description: "Share this with support only if needed.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "max-h-[min(90vh,52rem)] w-[calc(100%-1.5rem)] max-w-2xl gap-0 overflow-hidden border-zinc-200 bg-white p-0 text-zinc-900 shadow-xl sm:max-w-2xl",
          "[&_[data-slot=dialog-close]]:text-zinc-500 [&_[data-slot=dialog-close]]:hover:bg-zinc-100 [&_[data-slot=dialog-close]]:hover:text-zinc-900",
        )}
      >
        <DialogHeader className="space-y-1 border-b border-zinc-200 px-6 py-4 text-left">
          <DialogTitle className="font-clash text-lg font-semibold tracking-tight text-zinc-900">
            User details
          </DialogTitle>
          <DialogDescription className="font-epilogue text-sm text-zinc-600">
            {context?.title ?? "Select a user from the directory."}
          </DialogDescription>
        </DialogHeader>

        {!context || !user ? (
          <p className="px-6 py-8 font-epilogue text-sm text-zinc-600">
            Open this dialog from the Manage action on a row.
          </p>
        ) : (
          <div className="max-h-[calc(min(90vh,52rem)-5.5rem)] overflow-y-auto px-6 py-5">
            <div className="space-y-6 pb-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
                  Sign-in email
                </p>
                <p className="mt-1 break-all text-sm font-medium text-zinc-900">
                  {user.email}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-md bg-zinc-200 px-2 py-0.5 text-[11px] font-medium text-zinc-800 ring-1 ring-inset ring-zinc-300/80">
                    {roleLabel(user.role)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                      user.isDeleted
                        ? "bg-rose-50 text-rose-800 ring-rose-200"
                        : user.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                          : "bg-amber-50 text-amber-900 ring-amber-200",
                    )}
                  >
                    {user.isDeleted ? "Removed" : statusLabel(user.status)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyAccountReference}
                  className="mt-3 text-left text-[11px] font-medium text-zinc-600 underline-offset-2 transition-colors hover:text-zinc-900 hover:underline"
                >
                  Copy account reference
                </button>
              </div>

              {!canManage && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 font-epilogue text-sm text-amber-900">
                  Only a super administrator can modify this account.
                </p>
              )}

              {user.isDeleted && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 font-epilogue text-sm text-rose-800">
                  This account has been removed and cannot be edited here.
                </p>
              )}

              {detailQ.isLoading && (
                <p className="font-epilogue text-sm text-zinc-600">
                  Loading profile…
                </p>
              )}

              {detailQ.isError && (
                <p className="font-epilogue text-sm text-rose-700">
                  Profile could not be loaded. You can still update access
                  status below.
                </p>
              )}

              {detail && kind === "applicant" && (
                <section className="space-y-4 border-t border-zinc-200 pt-6">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    Applicant
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">Name</Label>
                      <Input
                        value={aName}
                        onChange={(e) => setAName(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">Address</Label>
                      <Input
                        value={aAddress}
                        onChange={(e) => setAAddress(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Phone</Label>
                      <Input
                        value={aPhone}
                        onChange={(e) => setAPhone(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Tier</Label>
                      <Select
                        value={aUserType}
                        onValueChange={setAUserType}
                        disabled={locked || busy}
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          {APPLICANT_USER_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">
                        Profile photo
                      </Label>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="text-xs text-zinc-600 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-2 file:py-1 file:text-xs file:text-zinc-800"
                        disabled={locked || busy}
                        onChange={(e) =>
                          setAImage(e.target.files?.[0] ?? null)
                        }
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">CV (PDF)</Label>
                      <Input
                        type="file"
                        accept="application/pdf"
                        className="text-xs text-zinc-600 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-2 file:py-1 file:text-xs file:text-zinc-800"
                        disabled={locked || busy}
                        onChange={(e) => setACv(e.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="h-9 w-full rounded-md bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800"
                    disabled={locked || busy}
                    onClick={() => void saveApplicantProfile()}
                  >
                    Save changes
                  </Button>
                </section>
              )}

              {detail && kind === "recruiter" && (
                <section className="space-y-4 border-t border-zinc-200 pt-6">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    Recruiter &amp; company
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Name</Label>
                      <Input
                        value={rName}
                        onChange={(e) => setRName(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Company</Label>
                      <Input
                        value={rCompany}
                        onChange={(e) => setRCompany(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">Website</Label>
                      <Input
                        value={rWebsite}
                        onChange={(e) => setRWebsite(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Phone</Label>
                      <Input
                        value={rPhone}
                        onChange={(e) => setRPhone(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Work email</Label>
                      <Input
                        value={rWorkEmail}
                        onChange={(e) => setRWorkEmail(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">Address</Label>
                      <Input
                        value={rAddress}
                        onChange={(e) => setRAddress(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Facebook</Label>
                      <Input
                        value={rFb}
                        onChange={(e) => setRFb(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">LinkedIn</Label>
                      <Input
                        value={rLi}
                        onChange={(e) => setRLi(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Company size</Label>
                      <Select
                        value={rSize || "__none__"}
                        onValueChange={(v) => setRSize(v === "__none__" ? "" : v)}
                        disabled={locked || busy}
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          <SelectItem value="__none__">—</SelectItem>
                          {COMPANY_SIZES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Plan</Label>
                      <Select
                        value={rPlan}
                        onValueChange={setRPlan}
                        disabled={locked || busy}
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          {SUBSCRIPTION_PLANS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Industry</Label>
                      <Select
                        value={rIndustry || "__none__"}
                        onValueChange={(v) => {
                          setRIndustry(v === "__none__" ? "" : v);
                          setRSub("");
                        }}
                        disabled={locked || busy}
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          <SelectItem value="__none__">—</SelectItem>
                          {industries.map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">
                        Sub-industry
                      </Label>
                      <Select
                        value={rSub || "__none__"}
                        onValueChange={(v) => setRSub(v === "__none__" ? "" : v)}
                        disabled={locked || busy || !rIndustry}
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          <SelectItem value="__none__">—</SelectItem>
                          {subIndustries.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 sm:col-span-2">
                      <Checkbox
                        checked={rVerified}
                        onCheckedChange={(c) => setRVerified(c === true)}
                        disabled={locked || busy}
                        className="border-zinc-600 data-[state=checked]:border-zinc-300 data-[state=checked]:bg-zinc-200 data-[state=checked]:text-zinc-900"
                      />
                      <span className="font-epilogue text-sm text-zinc-700">
                        Verified organization
                      </span>
                    </label>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Photo</Label>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="text-xs text-zinc-600 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-2 file:py-1 file:text-xs file:text-zinc-800"
                        disabled={locked || busy}
                        onChange={(e) =>
                          setRImage(e.target.files?.[0] ?? null)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-zinc-600">Logo</Label>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="text-xs text-zinc-600 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-2 file:py-1 file:text-xs file:text-zinc-800"
                        disabled={locked || busy}
                        onChange={(e) =>
                          setRLogo(e.target.files?.[0] ?? null)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="h-9 w-full rounded-md bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800"
                    disabled={locked || busy}
                    onClick={() => void saveRecruiterProfile()}
                  >
                    Save changes
                  </Button>
                </section>
              )}

              {detail && kind === "staff" && (
                <section className="space-y-4 border-t border-zinc-200 pt-6">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                    Administrator
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">Name</Label>
                      <Input
                        value={sName}
                        onChange={(e) => setSName(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">Address</Label>
                      <Input
                        value={sAddress}
                        onChange={(e) => setSAddress(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">Phone</Label>
                      <Input
                        value={sPhone}
                        onChange={(e) => setSPhone(e.target.value)}
                        className={fieldClass}
                        disabled={locked || busy}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-zinc-600">Photo</Label>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="text-xs text-zinc-600 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-2 file:py-1 file:text-xs file:text-zinc-800"
                        disabled={locked || busy}
                        onChange={(e) =>
                          setSImage(e.target.files?.[0] ?? null)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="h-9 w-full rounded-md bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800"
                    disabled={locked || busy}
                    onClick={() => void saveStaffProfile()}
                  >
                    Save changes
                  </Button>
                </section>
              )}

              <section className="space-y-3 border-t border-zinc-200 pt-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  Access
                </h3>
                <p className="font-epilogue text-xs leading-relaxed text-zinc-600">
                  Blocked users cannot sign in. Active users retain normal
                  access according to their role.
                </p>
                <Select
                  value={statusDraft}
                  onValueChange={setStatusDraft}
                  disabled={locked || busy || isSelf}
                >
                  <SelectTrigger className={cn(selectTriggerClass, "h-10")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {ACCOUNT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === "ACTIVE" ? "Active" : "Blocked"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full rounded-md border-zinc-200 bg-transparent text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                  disabled={locked || busy || isSelf || statusDraft === user.status}
                  onClick={() =>
                    updateStatus.mutate({
                      userId: user.id,
                      status: statusDraft as "ACTIVE" | "BLOCKED",
                    })
                  }
                >
                  Apply access status
                </Button>
                {isSelf && (
                  <p className="text-xs text-zinc-500 font-epilogue">
                    Ask another administrator to change your own access level.
                  </p>
                )}
              </section>

              <section className="space-y-2 border-t border-zinc-200 pt-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-rose-700">
                  Remove account
                </h3>
                <p className="font-epilogue text-xs leading-relaxed text-zinc-600">
                  The user will be signed out everywhere and marked as removed.
                  This does not erase historical records.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full rounded-md border-rose-200 bg-rose-50 text-sm font-medium text-rose-800 hover:bg-rose-100 hover:text-rose-900"
                  disabled={locked || busy || isSelf}
                  onClick={() => {
                    if (
                      !confirm(
                        `Remove access for ${user.email}? They will be signed out on all devices.`,
                      )
                    ) {
                      return;
                    }
                    softDelete.mutate(user.id, {
                      onSuccess: () => onOpenChange(false),
                    });
                  }}
                >
                  Remove account access
                </Button>
              </section>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
