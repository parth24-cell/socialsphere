"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { requestPasswordReset } from "@/actions/auth-v2";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setSuccess(true);
      } else {
        setError("Failed to send reset email");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
                  Forgot Password?
                </h2>
                <p className="text-white/60">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
                {error && (
                  <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur-sm">
                    {error}
                  </div>
                )}
                
                <AuthInput
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="flex w-full justify-center items-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
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
                <MailCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
                Check your inbox
              </h2>
              <p className="text-white/60 mb-8 max-w-[280px] mx-auto">
                If an account with <span className="text-white font-medium">{email}</span> exists, we have sent a password reset link.
              </p>
              
              <Link 
                href="/login" 
                className="inline-flex w-full justify-center items-center rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3.5 text-sm font-medium transition-all active:scale-[0.98]"
              >
                Return to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!success && (
          <div className="mt-8 text-center text-sm w-full">
            <Link href="/login" className="font-medium text-white/60 hover:text-white transition-colors">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
