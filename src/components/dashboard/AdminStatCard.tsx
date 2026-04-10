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
  accent?:
    | "indigo"
    | "emerald"
    | "amber"
    | "violet"
    | "rose"
    | "sky"
    | "cyan"
    | "slate";
}

/** Soft gradient fills — readable with dark text */
const cardBackgrounds = {
  indigo:
    "border-indigo-200/80 bg-linear-to-br from-indigo-100/90 via-indigo-50 to-violet-100/70 shadow-sm shadow-indigo-200/30",
  emerald:
    "border-emerald-200/80 bg-linear-to-br from-emerald-100/90 via-emerald-50 to-teal-100/60 shadow-sm shadow-emerald-200/30",
  amber:
    "border-amber-200/80 bg-linear-to-br from-amber-100/90 via-amber-50 to-orange-100/50 shadow-sm shadow-amber-200/30",
  violet:
    "border-violet-200/80 bg-linear-to-br from-violet-100/90 via-violet-50 to-fuchsia-100/55 shadow-sm shadow-violet-200/30",
  rose:
    "border-rose-200/80 bg-linear-to-br from-rose-100/90 via-rose-50 to-pink-100/55 shadow-sm shadow-rose-200/30",
  sky:
    "border-sky-200/80 bg-linear-to-br from-sky-100/90 via-sky-50 to-blue-100/55 shadow-sm shadow-sky-200/30",
  cyan:
    "border-cyan-200/80 bg-linear-to-br from-cyan-100/90 via-cyan-50 to-sky-100/50 shadow-sm shadow-cyan-200/30",
  slate:
    "border-slate-300/70 bg-linear-to-br from-slate-100 via-slate-50 to-zinc-100/80 shadow-sm shadow-slate-200/40",
};

const labelTone = {
  indigo: "text-indigo-900/70",
  emerald: "text-emerald-900/70",
  amber: "text-amber-900/75",
  violet: "text-violet-900/70",
  rose: "text-rose-900/70",
  sky: "text-sky-900/75",
  cyan: "text-cyan-900/75",
  slate: "text-slate-700",
};

const hintTone = {
  indigo: "text-indigo-950/55",
  emerald: "text-emerald-950/55",
  amber: "text-amber-950/60",
  violet: "text-violet-950/55",
  rose: "text-rose-950/55",
  sky: "text-sky-950/55",
  cyan: "text-cyan-950/55",
  slate: "text-slate-600",
};

const valueTone = {
  indigo: "text-indigo-950",
  emerald: "text-emerald-950",
  amber: "text-amber-950",
  violet: "text-violet-950",
  rose: "text-rose-950",
  sky: "text-sky-950",
  cyan: "text-cyan-950",
  slate: "text-slate-900",
};

/** Icon tile: light glass on top of gradient */
const iconStyles = {
  indigo:
    "border-white/70 bg-white/75 text-indigo-600 shadow-md shadow-indigo-900/10 backdrop-blur-sm",
  emerald:
    "border-white/70 bg-white/75 text-emerald-600 shadow-md shadow-emerald-900/10 backdrop-blur-sm",
  amber:
    "border-white/70 bg-white/75 text-amber-700 shadow-md shadow-amber-900/10 backdrop-blur-sm",
  violet:
    "border-white/70 bg-white/75 text-violet-600 shadow-md shadow-violet-900/10 backdrop-blur-sm",
  rose: "border-white/70 bg-white/75 text-rose-600 shadow-md shadow-rose-900/10 backdrop-blur-sm",
  sky: "border-white/70 bg-white/75 text-sky-600 shadow-md shadow-sky-900/10 backdrop-blur-sm",
  cyan: "border-white/70 bg-white/75 text-cyan-600 shadow-md shadow-cyan-900/10 backdrop-blur-sm",
  slate:
    "border-white/70 bg-white/75 text-slate-700 shadow-md shadow-slate-900/10 backdrop-blur-sm",
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
        "relative flex h-full min-h-33 flex-col overflow-hidden rounded-xl border p-5 transition-all duration-200",
        cardBackgrounds[accent],
        href && "group-hover:shadow-lg group-hover:brightness-[1.02]",
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/25 blur-2xl"
        aria-hidden
      />
      <div className="relative flex min-h-0 flex-1 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-epilogue text-[11px] font-semibold uppercase tracking-wider",
              labelTone[accent],
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-clash text-3xl font-bold tracking-tight tabular-nums",
              valueTone[accent],
            )}
          >
            {value}
          </p>
          {hint && (
            <p
              className={cn(
                "mt-2 line-clamp-2 font-epilogue text-xs leading-snug",
                hintTone[accent],
              )}
            >
              {hint}
            </p>
          )}
          {trend && (
            <p className="mt-2 font-epilogue text-xs font-semibold text-emerald-800">
              {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
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
