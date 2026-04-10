"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Bell,
  KeyRound,
  Mail,
  Server,
  Shield,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdminStaff } from "@/hooks/useAuth";

const tiles = [
  {
    title: "Authentication",
    desc: "Sessions use Better Auth. Registration for applicants & recruiters uses REST, then you sign in here.",
    icon: Shield,
  },
  {
    title: "Notifications",
    desc: "Wire email for application alerts when you connect a provider on the server.",
    icon: Bell,
  },
  {
    title: "API & keys",
    desc: "All modules mount under /api/v1 — jobs, industries, applications, admin, auth.",
    icon: KeyRound,
  },
  {
    title: "Branding",
    desc: "This client uses Syne + DM Sans and a teal–violet brand gradient.",
    icon: Sparkles,
  },
  {
    title: "Email templates",
    desc: "Password reset flows call forget-password and reset-password on your API.",
    icon: Mail,
  },
  {
    title: "Infrastructure",
    desc: "Prisma, PostgreSQL, and your host — keep DATABASE_URL and auth secrets in sync.",
    icon: Server,
  },
];

export default function DashboardSettingsPage() {
  const { data: session } = authClient.useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role as string | undefined;
  const isSuper = role === "SUPER_ADMIN";

  const createAdmin = useCreateAdminStaff();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const submitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || adminPassword.length < 6) return;
    try {
      await createAdmin.mutateAsync({
        password: adminPassword,
        admin: {
          email: adminEmail,
          name: adminName || undefined,
        },
      });
      setAdminEmail("");
      setAdminName("");
      setAdminPassword("");
    } catch {
      /* toast */
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header>
        <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Configuration
        </p>
        <h1 className="font-clash text-4xl font-bold text-zinc-900">Settings</h1>
        <p className="mt-2 max-w-2xl font-epilogue text-zinc-600">
          Operational notes and super-admin tools that call your live API.
        </p>
      </header>

      {isSuper ? (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-violet-50 text-violet-700">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-clash text-xl font-bold text-zinc-900">
                Invite staff admin
              </h2>
              <p className="mt-1 font-epilogue text-sm text-zinc-600">
                Uses{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-xs text-zinc-800">
                  POST /auth/create-admin
                </code>
                . New admins are flagged for password change on first sign-in.
              </p>
            </div>
          </div>
          <form
            onSubmit={submitAdmin}
            className="grid max-w-2xl gap-4 sm:grid-cols-2"
          >
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-zinc-700">Admin email</Label>
              <Input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="border-zinc-200 bg-white text-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-700">Display name (optional)</Label>
              <Input
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="border-zinc-200 bg-white text-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-700">Temporary password</Label>
              <Input
                type="password"
                required
                minLength={6}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="border-zinc-200 bg-white text-zinc-900"
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={createAdmin.isPending}
                className="rounded-xl bg-zinc-900 font-bold text-white hover:bg-zinc-800"
              >
                {createAdmin.isPending ? "Creating…" : "Create admin"}
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="font-epilogue text-sm text-zinc-600">
          Password reset for any user (verified email required):
        </p>
        <Button
          asChild
          variant="outline"
          className="rounded-xl border-zinc-300 text-zinc-800 hover:bg-zinc-50"
        >
          <Link href="/forgot-password" target="_blank" rel="noreferrer">
            Open forgot-password
          </Link>
        </Button>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        {tiles.map((tile) => (
          <div
            key={tile.title}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700">
              <tile.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-clash text-lg font-bold text-zinc-900">
                {tile.title}
              </h2>
              <p className="mt-2 font-epilogue text-sm leading-relaxed text-zinc-600">
                {tile.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
