"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { executePasswordReset } from "@/actions/auth-v2";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const email = searchParams?.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strScore = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      setError("Invalid reset link");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await executePasswordReset(email, token, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login?reset=true"), 3000);
      } else {
        setError(res.error || "Failed to reset password");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return <div className="p-4 text-center">Invalid password reset link.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-md border border-zinc-200 dark:border-zinc-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Set New Password</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Enter a strong password for your account</p>
        </div>

        {!success ? (
          <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 pr-10 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex gap-1 h-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`flex-1 rounded-full ${i <= strScore ? (strScore <= 2 ? "bg-red-500" : strScore <= 4 ? "bg-yellow-500" : "bg-green-500") : "bg-zinc-200 dark:bg-zinc-700"}`} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 pr-10 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || strScore < 3} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-green-600 font-medium bg-green-50 dark:bg-green-900/20 p-4 rounded-md mb-6">
              Password has been successfully reset! Redirecting to login...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
