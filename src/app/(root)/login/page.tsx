import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-zinc-50 py-20 px-4 sm:px-6 lg:px-8 bg-repeat bg-center"
      style={{ backgroundImage: "url('/assets/images/Pattern.svg')" }}
    >
      <LoginForm />
    </div>
  );
}
