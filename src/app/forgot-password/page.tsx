"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { requestPasswordReset } from "@/actions/auth-v2";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-md border border-zinc-200 dark:border-zinc-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Forgot Password</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Enter your email to receive a reset link</p>
        </div>

        {!success ? (
          <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
            </div>

            <button type="submit" disabled={loading || !email} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-green-600 font-medium bg-green-50 dark:bg-green-900/20 p-4 rounded-md mb-6">
              If an account with that email exists, we have sent a password reset link.
            </div>
          </div>
        )}
        
        <div className="text-center text-sm w-full">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
