import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Reset your password"
      subtitle="We’ll email you a token if your account is verified."
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
