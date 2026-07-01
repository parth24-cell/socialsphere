"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams?.get("verified");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rememberMe = formData.get("rememberMe") === "on";

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
      });

      if (res?.error) {
        if (res.error === "TOO_MANY_ATTEMPTS") {
          setError("Too many failed attempts. Please try again later.");
        } else if (res.error === "PENDING_VERIFICATION") {
          setError("Your account is not verified.");
          setTimeout(() => {
            router.push(`/verify?email=${encodeURIComponent(identifier)}`);
          }, 2000);
        } else if (res.error === "ACCOUNT_LOCKED") {
          setError("Your account has been locked or suspended.");
        } else {
          setError("Invalid email, username, or password");
        }
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Sign in
        </h2>
        <p className="text-white/60">
          Welcome back to SocialSphere.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {verified && (
          <div className="text-emerald-400 text-sm text-center font-medium bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
            Account verified! You can now log in.
          </div>
        )}
        
        {error && (
          <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <AuthInput
            label="Email or Username"
            type="text"
            name="identifier"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or username"
          />

          <div className="space-y-1">
            <PasswordInput
              label="Password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex items-center pt-2">
            <div className="relative flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 transition-all checked:border-amber-500 checked:bg-amber-500 hover:bg-white/10"
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
                  <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                </svg>
              </div>
            </div>
            <label htmlFor="rememberMe" className="ml-3 block text-sm font-medium text-white/80 cursor-pointer">
              Remember me
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-white/60">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-amber-500 hover:text-amber-400 transition-colors">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      </AuthLayout>
    }>
      <LoginContent />
    </Suspense>
  );
}
