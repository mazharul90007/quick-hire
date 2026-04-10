"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import {
  useAdminApplicants,
  usePatchAdminRecruiter,
  useAdminRecruiters,
  useAdminStaff,
} from "@/hooks/useAdmin";
import type {
  AdminApplicantRow,
  AdminRecruiterRow,
  AdminStaffRow,
} from "@/types";
import {
  AdminManageUserDialog,
  type AdminManageContext,
} from "@/components/dashboard/AdminManageUserDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MoreHorizontal,
} from "lucide-react";

type UserTab = "applicants" | "recruiters" | "staff";

const APPLICANT_USER_TYPES = ["NORMAL", "SILVER", "GOLD", "DIAMOND"] as const;
const SUBSCRIPTION_PLANS = ["FREE", "SILVER", "GOLD", "DIAMOND"] as const;

const avatarSizes = { sm: 36, md: 44 } as const;

function UserAvatar({
  src,
  name,
  size = "md",
}: {
  src: string | null | undefined;
  name: string;
  size?: keyof typeof avatarSizes;
}) {
  const px = avatarSizes[size];
  const initial =
    name.trim().replace(/[^a-zA-ZÀ-ÿ]/g, "").charAt(0).toUpperCase() ||
    name.charAt(0).toUpperCase() ||
    "?";

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={px}
        height={px}
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-zinc-200 bg-zinc-100",
          size === "sm" ? "h-9 w-9" : "h-11 w-11",
        )}
        unoptimized={src.startsWith("http") && !src.includes("localhost")}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 text-[13px] font-semibold text-zinc-600 tabular-nums",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
      )}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function BrandMark({
  src,
  alt,
  size = 40,
}: {
  src: string | null | undefined;
  alt: string;
  size?: number;
}) {
  if (!src) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-md bg-zinc-100 ring-1 ring-zinc-200 text-[10px] font-medium uppercase tracking-wider text-zinc-500"
        style={{ width: size, height: size }}
      >
        Co
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="shrink-0 rounded-md object-cover ring-1 ring-zinc-200 bg-white"
      unoptimized={src.startsWith("http") && !src.includes("localhost")}
    />
  );
}

function StatusBadge({ status, deleted }: { status: string; deleted: boolean }) {
  if (deleted) {
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums ring-1 ring-inset ring-rose-200 bg-rose-50 text-rose-800">
        Deleted
      </span>
    );
  }
  const active = status === "ACTIVE";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums ring-1 ring-inset",
        active
          ? "ring-emerald-200 bg-emerald-50 text-emerald-800"
          : "ring-amber-200 bg-amber-50 text-amber-900",
      )}
    >
      {status}
    </span>
  );
}

export default function ManageUsersPage() {
  const { data: session } = authClient.useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actorRole = String((session?.user as any)?.role ?? "");
  const actorUserId = session?.user?.id ?? "";

  const [tab, setTab] = useState<UserTab>("applicants");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<string>("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetContext, setSheetContext] = useState<AdminManageContext | null>(
    null,
  );
  const patchRecruiter = usePatchAdminRecruiter();

  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional filter reset
    setPage(1);
  }, [
    tab,
    debouncedSearch,
    includeDeleted,
    userTypeFilter,
    verifiedFilter,
    subscriptionFilter,
  ]);

  const applicantParams = useMemo(
    () => ({
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
      ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
      ...(includeDeleted ? { includeDeleted: "true" } : {}),
      ...(userTypeFilter ? { userType: userTypeFilter } : {}),
    }),
    [page, limit, debouncedSearch, includeDeleted, userTypeFilter],
  );

  const recruiterParams = useMemo(
    () => ({
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
      ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
      ...(includeDeleted ? { includeDeleted: "true" } : {}),
      ...(verifiedFilter === "true" || verifiedFilter === "false"
        ? { isVerified: verifiedFilter }
        : {}),
      ...(subscriptionFilter ? { subscriptionPlan: subscriptionFilter } : {}),
    }),
    [page, limit, debouncedSearch, includeDeleted, verifiedFilter, subscriptionFilter],
  );

  const staffParams = useMemo(
    () => ({
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
      ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
      ...(includeDeleted ? { includeDeleted: "true" } : {}),
    }),
    [page, limit, debouncedSearch, includeDeleted],
  );

  const applicantsQ = useAdminApplicants(
    tab === "applicants" ? applicantParams : { page: 1, limit: 1 },
  );
  const recruitersQ = useAdminRecruiters(
    tab === "recruiters" ? recruiterParams : { page: 1, limit: 1 },
  );
  const staffQ = useAdminStaff(
    tab === "staff" ? staffParams : { page: 1, limit: 1 },
  );

  const activeQuery =
    tab === "applicants"
      ? applicantsQ
      : tab === "recruiters"
        ? recruitersQ
        : staffQ;

  const rows = activeQuery.data?.data ?? [];
  const meta = activeQuery.data?.meta;
  const totalPages = meta
    ? Math.max(1, Math.ceil(meta.total / meta.limit))
    : 1;
  const isLoading = activeQuery.isLoading;
  const tableCols = tab === "staff" ? 4 : 5;

  function openManage(ctx: AdminManageContext) {
    setSheetContext(ctx);
    setSheetOpen(true);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="border-b border-zinc-200 pb-8">
        <h1 className="font-clash text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Users
        </h1>
        <p className="mt-2 max-w-2xl font-epilogue text-sm leading-relaxed text-zinc-600">
          Review accounts, profile photos, and status. Super-admin rules still
          apply on the server.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="User directory"
        className="flex gap-8 border-b border-zinc-200"
      >
        {(
          [
            ["applicants", "Applicants"],
            ["recruiters", "Recruiters"],
            ["staff", "Staff"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "relative pb-3 text-sm font-medium font-epilogue transition-colors",
              tab === key
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            {label}
            {tab === key ? (
              <span className="absolute right-0 bottom-0 left-0 h-px bg-zinc-900" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={
              tab === "recruiters"
                ? "Search company, name, or email"
                : "Search name or email"
            }
            className="h-10 rounded-md border-zinc-200 bg-white pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-400"
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          {tab === "applicants" && (
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">
                Type
              </Label>
              <Select
                value={userTypeFilter || "__all__"}
                onValueChange={(v) =>
                  setUserTypeFilter(v === "__all__" ? "" : v)
                }
              >
                <SelectTrigger className="h-9 w-[168px] rounded-md border-zinc-200 bg-white text-sm text-zinc-900">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent className="border-zinc-200 bg-white text-zinc-900">
                  <SelectItem value="__all__">All types</SelectItem>
                  {APPLICANT_USER_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {tab === "recruiters" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">
                  Verified
                </Label>
                <Select
                  value={verifiedFilter || "__all__"}
                  onValueChange={(v) =>
                    setVerifiedFilter(v === "__all__" ? "" : v)
                  }
                >
                  <SelectTrigger className="h-9 w-[152px] rounded-md border-zinc-200 bg-white text-sm text-zinc-900">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-200 bg-white text-zinc-900">
                    <SelectItem value="__all__">All</SelectItem>
                    <SelectItem value="true">Verified</SelectItem>
                    <SelectItem value="false">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">
                  Plan
                </Label>
                <Select
                  value={subscriptionFilter || "__all__"}
                  onValueChange={(v) =>
                    setSubscriptionFilter(v === "__all__" ? "" : v)
                  }
                >
                  <SelectTrigger className="h-9 w-[152px] rounded-md border-zinc-200 bg-white text-sm text-zinc-900">
                    <SelectValue placeholder="All plans" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-200 bg-white text-zinc-900">
                    <SelectItem value="__all__">All plans</SelectItem>
                    {SUBSCRIPTION_PLANS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <label className="flex cursor-pointer select-none items-center gap-2.5 pt-5 sm:pt-0">
            <Checkbox
              checked={includeDeleted}
              onCheckedChange={(c) => setIncludeDeleted(c === true)}
              className="border-zinc-600 data-[state=checked]:border-zinc-300 data-[state=checked]:bg-zinc-200 data-[state=checked]:text-zinc-900"
            />
            <span className="font-epilogue text-sm text-zinc-600">
              Include deleted
            </span>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                {tab === "applicants" && (
                  <>
                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                      User
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                      Tier
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                      Role
                    </th>
                  </>
                )}
                {tab === "recruiters" && (
                  <>
                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                      Organization
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                      Primary contact
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                      Plan
                    </th>
                  </>
                )}
                {tab === "staff" && (
                  <>
                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                      Administrator
                    </th>
                    <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                      Role
                    </th>
                  </>
                )}
                <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                  Status
                </th>
                <th className="w-28 px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 sm:px-5">
                  <span className="sr-only sm:not-sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="font-epilogue">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-100">
                    <td colSpan={tableCols} className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-zinc-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 w-40 animate-pulse rounded bg-zinc-200" />
                          <div className="h-3 w-56 animate-pulse rounded bg-zinc-100" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableCols}
                    className="px-5 py-20 text-center text-sm text-zinc-500"
                  >
                    No results for the current filters.
                  </td>
                </tr>
              ) : tab === "applicants" ? (
                (rows as AdminApplicantRow[]).map((row) => (
                  <ApplicantTableRow
                    key={row.id}
                    row={row}
                    onManage={() =>
                      openManage({
                        kind: "applicant",
                        profileId: row.id,
                        user: row.user,
                        title: row.name || row.user.email || "Applicant",
                      })
                    }
                  />
                ))
              ) : tab === "recruiters" ? (
                (rows as AdminRecruiterRow[]).map((row) => (
                  <RecruiterTableRow
                    key={row.id}
                    row={row}
                    verifyLoading={patchRecruiter.isPending}
                    onVerify={() =>
                      patchRecruiter.mutate({
                        id: row.id,
                        payload: { isVerified: true },
                      })
                    }
                    onManage={() =>
                      openManage({
                        kind: "recruiter",
                        profileId: row.id,
                        user: row.user,
                        title:
                          row.companyName ||
                          row.recruiterName ||
                          row.user.email,
                      })
                    }
                  />
                ))
              ) : (
                (rows as AdminStaffRow[]).map((row) => (
                  <StaffTableRow
                    key={row.id}
                    row={row}
                    onManage={() =>
                      openManage({
                        kind: "staff",
                        profileId: row.id,
                        user: row.user,
                        title: row.name || row.user.email || "Staff",
                      })
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
        <p className="font-epilogue text-sm tabular-nums text-zinc-600">
          {meta ? (
            <>
              {meta.total} {meta.total === 1 ? "record" : "records"}
              <span className="mx-2 text-zinc-700">·</span>
              Page {meta.page} of {totalPages}
            </>
          ) : null}
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-9 w-9 border-zinc-200 bg-white p-0 text-zinc-700 hover:bg-zinc-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 w-9 border-zinc-200 bg-white p-0 text-zinc-700 hover:bg-zinc-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AdminManageUserDialog
        key={sheetContext?.profileId ?? "idle"}
        open={sheetOpen}
        onOpenChange={(o) => {
          setSheetOpen(o);
          if (!o) setSheetContext(null);
        }}
        context={sheetContext}
        actorRole={actorRole}
        actorUserId={actorUserId}
      />
    </div>
  );
}

function ApplicantTableRow({
  row,
  onManage,
}: {
  row: AdminApplicantRow;
  onManage: () => void;
}) {
  const u = row.user;
  const display = row.name || u.name || "—";
  return (
    <tr className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/80">
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3.5">
          <UserAvatar src={u.image} name={display} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-zinc-900">
              {display}
            </div>
            <div className="truncate text-xs text-zinc-500">{u.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-zinc-600 sm:px-5">
        {row.userType}
      </td>
      <td className="px-4 py-4 sm:px-5">
        <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/80">
          {u.role}
        </span>
      </td>
      <td className="px-4 py-4 sm:px-5">
        <StatusBadge status={u.status} deleted={u.isDeleted} />
      </td>
      <td className="px-4 py-4 sm:px-5">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onManage}
          className="h-8 gap-1.5 rounded-md px-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <MoreHorizontal className="h-4 w-4 opacity-70" />
          Manage
        </Button>
      </td>
    </tr>
  );
}

function RecruiterTableRow({
  row,
  onVerify,
  verifyLoading,
  onManage,
}: {
  row: AdminRecruiterRow;
  onVerify: () => void;
  verifyLoading: boolean;
  onManage: () => void;
}) {
  const u = row.user;
  const company = row.companyName || "—";
  const contactName = u.name || row.recruiterName || "—";
  return (
    <tr className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/80">
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <BrandMark
            src={row.companyLogo}
            alt={company === "—" ? "Company" : company}
          />
          <div className="min-w-0 pt-0.5">
            <div className="truncate text-sm font-medium text-zinc-900">
              {company}
            </div>
            {row.recruiterName ? (
              <div className="truncate text-xs text-zinc-500">
                {row.recruiterName}
              </div>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar src={u.image} name={contactName} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm text-zinc-800">{u.email}</div>
            <div className="truncate text-xs text-zinc-500">{contactName}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 sm:px-5">
        <div className="text-sm text-zinc-800 tabular-nums">
          {row.subscriptionPlan ?? "—"}
        </div>
        <div className="mt-1 text-[11px] text-zinc-500">
          {row.isVerified ? (
            <span className="text-emerald-700">Verified</span>
          ) : (
            <span>Unverified</span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 sm:px-5">
        <StatusBadge status={u.status} deleted={u.isDeleted} />
      </td>
      <td className="px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2">
          {!row.isVerified && !u.isDeleted ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={verifyLoading}
              onClick={onVerify}
              className="h-8 rounded-md border-emerald-200 bg-emerald-50 px-2.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
            >
              Verify
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onManage}
            className="h-8 gap-1.5 rounded-md px-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <MoreHorizontal className="h-4 w-4 opacity-70" />
            Manage
          </Button>
        </div>
      </td>
    </tr>
  );
}

function StaffTableRow({
  row,
  onManage,
}: {
  row: AdminStaffRow;
  onManage: () => void;
}) {
  const u = row.user;
  const display = row.name || u.name || "—";
  return (
    <tr className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/80">
      <td className="px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3.5">
          <UserAvatar src={u.image} name={display} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-zinc-900">
              {display}
            </div>
            <div className="truncate text-xs text-zinc-500">{u.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 sm:px-5">
        <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/80">
          {u.role}
        </span>
      </td>
      <td className="px-4 py-4 sm:px-5">
        <StatusBadge status={u.status} deleted={u.isDeleted} />
      </td>
      <td className="px-4 py-4 sm:px-5">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onManage}
          className="h-8 gap-1.5 rounded-md px-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <MoreHorizontal className="h-4 w-4 opacity-70" />
          Manage
        </Button>
      </td>
    </tr>
  );
}
