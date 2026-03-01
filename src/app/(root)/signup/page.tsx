import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <SignupForm />
        </div>
    );
}
