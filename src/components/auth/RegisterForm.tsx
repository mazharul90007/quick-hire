"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useGetIndustries } from "@/hooks/useIndustry";
import {
  useRegisterApplicant,
  useRegisterRecruiter,
} from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Briefcase, Eye, EyeOff, UserRound, Loader2 } from "lucide-react";
import type { RegisterRecruiterPayload } from "@/lib/api-client";

type Tab = "applicant" | "recruiter";

const COMPANY_SIZES = [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "VERY_LARGE",
  "ENTERPRISE",
] as const;

function buildRecruiterPayload(
  raw: Record<string, string>,
): RegisterRecruiterPayload["recruiter"] {
  const r: RegisterRecruiterPayload["recruiter"] = {};
  const t = (s: string) => s.trim();
  if (t(raw.recruiterName)) r.recruiterName = t(raw.recruiterName);
  if (t(raw.recruiterPhone)) r.recruiterPhone = t(raw.recruiterPhone);
  if (t(raw.recruiterWorkEmail)) r.recruiterWorkEmail = t(raw.recruiterWorkEmail);
  if (t(raw.companyName)) r.companyName = t(raw.companyName);
  if (t(raw.companyAddress)) r.companyAddress = t(raw.companyAddress);
  if (t(raw.companyFacebookId)) r.companyFacebookId = t(raw.companyFacebookId);
  if (t(raw.companyLinkedInId)) r.companyLinkedInId = t(raw.companyLinkedInId);
  if (t(raw.companyWebsite)) {
    try {
      new URL(t(raw.companyWebsite));
      r.companyWebsite = t(raw.companyWebsite);
    } catch {
      /* skip invalid URL */
    }
  }
  if (t(raw.companySize)) r.companySize = t(raw.companySize);
  if (t(raw.industryId)) r.industryId = t(raw.industryId);
  if (t(raw.subIndustryId)) r.subIndustryId = t(raw.subIndustryId);
  return r;
}

export function RegisterForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("applicant");
  const regA = useRegisterApplicant();
  const regR = useRegisterRecruiter();
  const { data: industries = [] } = useGetIndustries();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantAddress, setApplicantAddress] = useState("");

  const [recruiterName, setRecruiterName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [recruiterWorkEmail, setRecruiterWorkEmail] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [subIndustryId, setSubIndustryId] = useState("");

  const subs = useMemo(() => {
    const ind = industries.find((i) => i.id === industryId);
    return ind?.subIndustries ?? [];
  }, [industries, industryId]);

  const loading = regA.isPending || regR.isPending;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    if (password.length < 6) return;

    try {
      if (tab === "applicant") {
        await regA.mutateAsync({
          email,
          password,
          applicant: {
            name: applicantName || undefined,
            phone: applicantPhone || undefined,
            address: applicantAddress || undefined,
          },
        });
      } else {
        await regR.mutateAsync({
          email,
          password,
          recruiter: buildRecruiterPayload({
            recruiterName,
            companyName,
            companyWebsite,
            recruiterWorkEmail,
            recruiterPhone,
            companyAddress,
            companyFacebookId: "",
            companyLinkedInId: "",
            companySize,
            industryId,
            subIndustryId,
          }),
        });
      }
      router.push("/login");
    } catch {
      /* toast from mutation */
    }
  };

  return (
    <div className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_24px_80px_-24px_oklch(0.35_0.08_260/0.35)] p-6 sm:p-8 font-epilogue">
      <div className="flex rounded-xl bg-muted/50 p-1 mb-8">
        <button
          type="button"
          onClick={() => setTab("applicant")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
            tab === "applicant"
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <UserRound className="h-4 w-4" />
          Job seeker
        </button>
        <button
          type="button"
          onClick={() => setTab("recruiter")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
            tab === "recruiter"
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Briefcase className="h-4 w-4" />
          Recruiter
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-white/80"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pr-10 bg-white/80"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPw(!showPw)}
              aria-label="Toggle password"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type={showPw ? "text" : "password"}
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11 bg-white/80"
          />
        </div>

        {tab === "applicant" ? (
          <>
            <div className="grid gap-2">
              <Label htmlFor="name">Full name (optional)</Label>
              <Input
                id="name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                value={applicantAddress}
                onChange={(e) => setApplicantAddress(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-2">
              <Label htmlFor="rn">Your name</Label>
              <Input
                id="rn"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cn">Company name</Label>
              <Input
                id="cn"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cw">Company website (optional, full URL)</Label>
              <Input
                id="cw"
                placeholder="https://"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rwe">Work email (optional)</Label>
              <Input
                id="rwe"
                type="email"
                value={recruiterWorkEmail}
                onChange={(e) => setRecruiterWorkEmail(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rp">Phone (optional)</Label>
              <Input
                id="rp"
                value={recruiterPhone}
                onChange={(e) => setRecruiterPhone(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ca">Company address (optional)</Label>
              <Input
                id="ca"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="h-11 bg-white/80"
              />
            </div>
            <div className="grid gap-2">
              <Label>Company size (optional)</Label>
              <Select
                value={companySize || "__none__"}
                onValueChange={(v) =>
                  setCompanySize(v === "__none__" ? "" : v)
                }
              >
                <SelectTrigger className="h-11 bg-white/80">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">—</SelectItem>
                  {COMPANY_SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Industry (optional)</Label>
              <Select
                value={industryId || "__none__"}
                onValueChange={(v) => {
                  setIndustryId(v === "__none__" ? "" : v);
                  setSubIndustryId("");
                }}
              >
                <SelectTrigger className="h-11 bg-white/80">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">—</SelectItem>
                  {industries.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {subs.length > 0 ? (
              <div className="grid gap-2">
                <Label>Sub-industry (optional)</Label>
                <Select
                  value={subIndustryId || "__none__"}
                  onValueChange={(v) =>
                    setSubIndustryId(v === "__none__" ? "" : v)
                  }
                >
                  <SelectTrigger className="h-11 bg-white/80">
                    <SelectValue placeholder="Sub-industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {subs.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </>
        )}

        {password && confirm && password !== confirm ? (
          <p className="text-sm text-destructive">Passwords do not match.</p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
