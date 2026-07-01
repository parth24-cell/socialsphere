"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { executePasswordReset } from "@/actions/auth-v2";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const email = searchParams?.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    return (
      <AuthLayout>
        <div className="text-center p-8">
          <p className="text-white/60 mb-6">Invalid or expired password reset link.</p>
          <Link 
            href="/forgot-password" 
            className="inline-flex justify-center items-center rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3.5 text-sm font-medium transition-all active:scale-[0.98]"
          >
            Request New Link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="relative">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                  Set New Password
                </h2>
                <p className="text-white/60">
                  Enter a new strong password for your account.
                </p>
              </div>

              <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
                {error && (
                  <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur-sm">
                    {error}
                  </div>
                )}
                
                <PasswordInput
                  label="New Password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  showStrength
                />

                <PasswordInput
                  label="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
                />

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !password || password !== confirmPassword}
                    className="flex w-full justify-center items-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)] border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
                Password Reset Successfully
              </h2>
              <p className="text-white/60 mb-8 max-w-[280px] mx-auto">
                Your password has been changed. You will be redirected to the login page momentarily.
              </p>
              
              <Link 
                href="/login" 
                className="inline-flex w-full justify-center items-center rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3.5 text-sm font-medium transition-all active:scale-[0.98]"
              >
                Go to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      </AuthLayout>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
