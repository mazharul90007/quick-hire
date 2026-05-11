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
  accent?: "primary" | "secondary" | "muted";
}

/** Professional palette - using Primary (Blue), Secondary (Emerald), and Muted (Slate) */
const cardBackgrounds = {
  primary:
    "border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-primary/15 shadow-sm shadow-primary/5",
  secondary:
    "border-secondary/20 bg-linear-to-br from-secondary/10 via-secondary/5 to-secondary/15 shadow-sm shadow-secondary/5",
  muted:
    "border-border bg-linear-to-br from-muted/30 via-muted/10 to-muted/40 shadow-sm",
};

const labelTone = {
  primary: "text-primary/70",
  secondary: "text-secondary/70",
  muted: "text-muted-foreground",
};

const hintTone = {
  primary: "text-primary/60",
  secondary: "text-secondary/60",
  muted: "text-muted-foreground/70",
};

const valueTone = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-foreground",
};

/** Icon tile: light glass on top of gradient */
const iconStyles = {
  primary:
    "border-primary/20 bg-white text-primary shadow-md shadow-primary/10 backdrop-blur-sm",
  secondary:
    "border-secondary/20 bg-white text-secondary shadow-md shadow-secondary/10 backdrop-blur-sm",
  muted:
    "border-border bg-white text-muted-foreground shadow-md backdrop-blur-sm",
};

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  trend,
  accent = "primary",
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
