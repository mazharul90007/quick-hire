"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-sm border-zinc-100 rounded-none">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold tracking-tight text-[#2D2D2D] font-clash">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-zinc-600 font-display">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-zinc-700 font-display"
                            >
                                Email address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-none border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-zinc-700 font-display"
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-none border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 font-medium font-display">{error}</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 py-6 text-sm font-bold text-white hover:bg-indigo-700 rounded-none font-display transition-all"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </Button>

                    <div className="text-center text-sm font-display">
                        <span className="text-zinc-600">Don't have an account? </span>
                        <Link
                            href="/signup"
                            className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
