"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgetPassword } from "@/hooks/useAuth";
import { Loader2, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const forget = useForgetPassword();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forget.mutateAsync(email);
    } catch {
      /* toast */
    }
  };

  return (
    <div className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_24px_80px_-24px_oklch(0.35_0.08_260/0.35)] p-6 sm:p-8 font-epilogue">
      <form onSubmit={submit} className="space-y-5">
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
        <p className="text-sm text-muted-foreground leading-relaxed">
          Calls{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            POST /auth/forget-password
          </code>
          . You must have a verified email for a reset link to be sent.
        </p>
        <Button
          type="submit"
          disabled={forget.isPending}
          className="w-full h-12 font-bold rounded-xl"
        >
          {forget.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
