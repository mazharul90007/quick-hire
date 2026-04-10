"use client";

import { PortalShell } from "@/components/portal/PortalShell";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Building2,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/recruiter", icon: LayoutDashboard },
  { name: "My jobs", href: "/recruiter/jobs", icon: Briefcase },
  {
    name: "Applications",
    href: "/recruiter/applications",
    icon: ClipboardList,
  },
  { name: "Company profile", href: "/recruiter/profile", icon: Building2 },
];

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      allowedRole="RECRUITER"
      subtitle="Recruiter"
      basePath="/recruiter"
      navItems={navItems}
    >
      {children}
    </PortalShell>
  );
}
