import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthPageShell
      title="Choose a new password"
      subtitle="Paste the token from your email (or open the link from your inbox)."
    >
      <Suspense
        fallback={
          <div className="h-48 rounded-2xl bg-white/40 animate-pulse border border-white/40" />
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}
