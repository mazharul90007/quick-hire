"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  KeyRound,
  User,
  Building2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPostLoginDashboardPath } from "@/lib/postLoginPath";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      if (res && typeof res === "object" && "error" in res && res.error) {
        setError(String(res.error.message || "Invalid email or password."));
        return;
      }
      const next = await getPostLoginDashboardPath();
      router.push(next);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_24px_80px_-24px_oklch(0.35_0.08_260/0.35)] p-6 sm:p-8 font-epilogue relative">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9 border-border"
              title="Demo credentials"
            >
              <KeyRound className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Demo fill
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setEmail("user@gmail.com");
                setPassword("pass123456");
              }}
              className="gap-2 cursor-pointer"
            >
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Applicant</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEmail("recruiter@gmail.com");
                setPassword("pass123456");
              }}
              className="gap-2 cursor-pointer"
            >
              <Building2 className="h-4 w-4 text-sky-600" />
              <span className="text-sm font-semibold">Recruiter</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEmail("admin@gmail.com");
                setPassword("pass123456");
              }}
              className="gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold">Admin</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-center mb-8 pr-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-clash text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Sign in to manage applications and job posts.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 bg-white/80"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center gap-2">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 bg-white/80"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground pt-2">
          New here?{" "}
          <Link href="/signup" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};
