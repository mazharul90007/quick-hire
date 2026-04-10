import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function SignupPage() {
  return (
    <AuthPageShell
      title="Join QuickHire"
      subtitle="Register as a job seeker or recruiter — your profile is created via the REST API, then you sign in with Better Auth."
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
