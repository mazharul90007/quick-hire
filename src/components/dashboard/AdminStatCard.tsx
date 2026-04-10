"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  trend?: string;
  accent?: "indigo" | "emerald" | "amber" | "violet" | "rose";
}

const cardShell = "border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md";

const iconStyles = {
  indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  amber: "border-amber-100 bg-amber-50 text-amber-800",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
};

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  trend,
  accent = "indigo",
}: AdminStatCardProps) {
  const inner = (
    <div
      className={cn(
        "relative flex h-full min-h-33 flex-col overflow-hidden rounded-xl p-5",
        cardShell,
      )}
    >
      <div className="flex min-h-0 flex-1 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-epilogue text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {label}
          </p>
          <p className="mt-2 font-clash text-3xl font-bold tracking-tight text-zinc-900 tabular-nums">
            {value}
          </p>
          {hint && (
            <p className="mt-2 line-clamp-2 font-epilogue text-xs leading-snug text-zinc-500">
              {hint}
            </p>
          )}
          {trend && (
            <p className="mt-2 font-epilogue text-xs font-semibold text-emerald-700">
              {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border",
            iconStyles[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block h-full min-h-0">
        {inner}
      </Link>
    );
  }
  return <div className="h-full min-h-0">{inner}</div>;
}
