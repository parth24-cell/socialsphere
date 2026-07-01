"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OTPInput } from "input-otp";
import { Loader2 } from "lucide-react";
import { verifyUserOTP, sendVerificationOTP } from "@/actions/auth-v2";
import { AuthLayout } from "@/components/auth/AuthLayout";

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
    return (
      <AuthLayout>
        <div className="text-center p-8">
          <p className="text-white/60">Missing email parameter. Please start registration again.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Verify Email
        </h2>
        <p className="text-white/60">
          Please enter the 6-digit code sent to <br/>
          <span className="text-white font-medium">{email}</span>
        </p>
      </div>

      <form className="space-y-8 flex flex-col items-center" onSubmit={handleVerify}>
        {error && (
          <div className="text-red-400 text-sm text-center w-full font-medium bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        
        <OTPInput 
          maxLength={6} 
          value={otp} 
          onChange={setOtp} 
          autoFocus 
          render={({ slots }) => (
            <div className="flex gap-2 justify-center">
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-14 flex items-center justify-center text-xl font-semibold rounded-xl border transition-all duration-300
                    ${slot.isActive 
                      ? "border-amber-500 bg-white/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                      : "border-white/20 bg-white/5"
                    } text-white
                  `}
                >
                  {slot.char || (slot.isActive && <span className="w-0.5 h-6 bg-amber-500 animate-pulse" />)}
                </div>
              ))}
            </div>
          )}
        />

        <div className="w-full space-y-4">
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex w-full justify-center items-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Account"}
          </button>

          <div className="text-center text-sm w-full">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="font-medium text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:hover:text-white/60"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't receive a code? Resend"}
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      </AuthLayout>
    }>
      <VerifyContent />
    </Suspense>
  );
}
