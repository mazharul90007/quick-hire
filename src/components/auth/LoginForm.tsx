"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, KeyRound, User, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-zinc-100 p-8 md:p-10 shadow-xl rounded-xl shadow-zinc-200/50 font-epilogue">
        <div className="text-center mb-10 relative px-10">
          <div className="absolute right-0 top-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-zinc-200 hover:border-[#4640DE] hover:text-[#4640DE] transition-all cursor-pointer h-10 w-10"
                  title="Test Credentials"
                >
                  <KeyRound size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-epilogue rounded-xl border-zinc-100 shadow-2xl p-2">
                <DropdownMenuLabel className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2 py-2">
                  Test Credentials
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-50" />
                <DropdownMenuItem
                  onClick={() => {
                    setEmail("user@gmail.com");
                    setPassword("pass123456");
                  }}
                  className="flex items-center gap-3 py-3 px-3 cursor-pointer rounded-lg hover:bg-zinc-50 focus:bg-zinc-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <User size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zinc-900 leading-none">User Account</span>
                    <span className="text-[10px] text-zinc-500 mt-1">user@gmail.com</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setEmail("admin@gmail.com");
                    setPassword("pass123456");
                  }}
                  className="flex items-center gap-3 py-3 px-3 cursor-pointer rounded-lg hover:bg-zinc-50 focus:bg-zinc-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zinc-900 leading-none">Admin Account</span>
                    <span className="text-[10px] text-zinc-500 mt-1">admin@gmail.com</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#2D2D2D] font-clash mb-3">
            Welcome Back
          </h1>
          <p className="text-[#515B6F] font-medium">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
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
                  className="pl-11 h-12 rounded-none border-zinc-200 focus:border-[#4640DE] focus:ring-1 focus:ring-[#4640DE] transition-all placeholder:text-zinc-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-[#202430]"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-[#4640DE] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
                  className="pl-11 pr-11 h-12 rounded-none border-zinc-200 focus:border-[#4640DE] focus:ring-1 focus:ring-[#4640DE] transition-all placeholder:text-zinc-300"
                  placeholder="Enter your password"
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
            className="w-full bg-[#4640DE] h-14 text-base font-bold text-white hover:bg-[#3b36c0] rounded-none shadow-lg shadow-[#4640DE]/20 transition-all disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Login"
            )}
          </Button>

          <div className="text-center pt-2">
            <p className="text-[#515B6F] font-medium text-sm">
              Do not have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#4640DE] hover:underline transition-all"
              >
                Sign Up Now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
