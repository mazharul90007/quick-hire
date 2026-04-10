"use client";

import { PortalShell } from "@/components/portal/PortalShell";
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/applicant", icon: LayoutDashboard },
  {
    name: "My applications",
    href: "/applicant/applications",
    icon: ClipboardList,
  },
  { name: "Courses", href: "/applicant/courses", icon: GraduationCap },
  { name: "Profile", href: "/applicant/profile", icon: UserCircle },
];

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      allowedRole="APPLICANT"
      subtitle="Applicant"
      basePath="/applicant"
      navItems={navItems}
    >
      {children}
    </PortalShell>
  );
}
