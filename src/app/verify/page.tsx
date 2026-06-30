"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OTPInput } from "input-otp";
import { Loader2 } from "lucide-react";
import { verifyUserOTP, sendVerificationOTP } from "@/actions/auth-v2";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !email) return;

    setLoading(true);
    setError("");

    try {
      const res = await verifyUserOTP(email, otp);
      
      if (res.success) {
        router.push("/login?verified=true");
      } else {
        setError(res.error || "Verification failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setLoading(true);
    setError("");
    try {
      const res = await sendVerificationOTP(email);
      if (res.success) {
        setResendCooldown(60);
      } else {
        setError(res.error || "Failed to resend OTP");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <div className="p-4 text-center">Missing email parameter</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-md border border-zinc-200 dark:border-zinc-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Verify Account</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Please enter the 6-digit code sent to {email}</p>
        </div>

        <form className="space-y-6 flex flex-col items-center" onSubmit={handleVerify}>
          {error && <div className="text-red-500 text-sm text-center w-full font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</div>}
          
          <OTPInput 
            maxLength={6} 
            value={otp} 
            onChange={setOtp} 
            autoFocus 
            render={({ slots }) => (
              <div className="flex justify-center gap-2">
                {slots.map((slot, idx) => (
                  <div key={idx} className={`w-12 h-12 text-lg flex items-center justify-center border ${slot.isActive ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-md text-zinc-900 dark:text-zinc-100 bg-transparent`}>
                    {slot.char !== null ? slot.char : ""}
                  </div>
                ))}
              </div>
            )}
          />

          <button type="submit" disabled={loading || otp.length !== 6} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Account"}
          </button>

          <div className="text-center text-sm w-full">
            <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading} className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:hover:text-indigo-600">
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't receive a code? Resend"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
