"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck } from "lucide-react";

export const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-zinc-100 p-8 md:p-10 shadow-xl rounded-xl shadow-zinc-200/50 font-epilogue">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#2D2D2D] font-clash mb-3">
            Create Account
          </h1>
          <p className="text-[#515B6F] font-medium">
            Join QuickHire and find your dream job today
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-bold text-[#202430]"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#4640DE] transition-colors">
                  <User size={18} />
                </div>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 rounded-none border-zinc-200 focus:border-[#4640DE] focus:ring-1 focus:ring-[#4640DE] transition-all placeholder:text-zinc-300 font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-[#202430]"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#4640DE] transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-none border-zinc-200 focus:border-[#4640DE] focus:ring-1 focus:ring-[#4640DE] transition-all placeholder:text-zinc-300 font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-[#202430]"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#4640DE] transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 rounded-none border-zinc-200 focus:border-[#4640DE] focus:ring-1 focus:ring-[#4640DE] transition-all placeholder:text-zinc-300 font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#4640DE] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-bold text-[#202430]"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#4640DE] transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-11 pr-11 h-12 rounded-none border-zinc-200 focus:ring-1 transition-all placeholder:text-zinc-300 font-medium ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "focus:border-[#4640DE] focus:ring-[#4640DE]"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#4640DE] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-3 flex items-center gap-3 text-red-600 text-sm font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4640DE] h-14 text-base font-bold text-white hover:bg-[#3b36c0] rounded-none shadow-lg shadow-[#4640DE]/20 transition-all disabled:opacity-70 mt-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Get Started"
            )}
          </Button>

          <div className="text-center pt-2">
            <p className="text-[#515B6F] font-medium text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#4640DE] hover:underline transition-all"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
