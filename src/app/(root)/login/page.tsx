import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Sign in"
      subtitle="Use the email and password for your QuickHire account."
    >
      <LoginForm />
    </AuthPageShell>
  );
}
