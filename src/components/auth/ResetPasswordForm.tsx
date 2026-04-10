"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/useAuth";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(
    () => searchParams.get("token") ?? "",
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const reset = useResetPassword();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm || password.length < 6) return;
    try {
      await reset.mutateAsync({ token, newPassword: password });
      router.push("/login");
    } catch {
      /* toast */
    }
  };

  return (
    <div className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_24px_80px_-24px_oklch(0.35_0.08_260/0.35)] p-6 sm:p-8 font-epilogue">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Reset token</Label>
          <Input
            id="token"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="h-11 bg-white/80 font-mono text-xs"
            placeholder="Paste token from email link"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="np">New password</Label>
          <div className="relative">
            <Input
              id="np"
              type={show ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pr-10 bg-white/80"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShow(!show)}
              aria-label="Toggle"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf">Confirm</Label>
          <Input
            id="cf"
            type={show ? "text" : "password"}
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11 bg-white/80"
          />
        </div>
        {password && confirm && password !== confirm ? (
          <p className="text-sm text-destructive">Passwords do not match.</p>
        ) : null}
        <Button
          type="submit"
          disabled={reset.isPending}
          className="w-full h-12 font-bold rounded-xl"
        >
          {reset.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
