"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OTPInput } from "input-otp";
import { Check, X, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { checkUsernameAvailability, checkEmailAvailability, verifyUserOTP, sendVerificationOTP } from "@/actions/auth-v2";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterClient() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation State
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [emailMsg, setEmailMsg] = useState("");

  // OTP State
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Debounced Checks
  useEffect(() => {
    if (username.length >= 3) {
      setUsernameStatus("loading");
      const delay = setTimeout(async () => {
        const res = await checkUsernameAvailability(username);
        if (res.available) {
          setUsernameStatus("valid");
          setUsernameMsg("Username is available");
        } else {
          setUsernameStatus("invalid");
          setUsernameMsg(res.error || "Username is taken");
        }
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setUsernameStatus("idle");
      setUsernameMsg("");
    }
  }, [username]);

  useEffect(() => {
    if (email.includes("@")) {
      setEmailStatus("loading");
      const delay = setTimeout(async () => {
        const res = await checkEmailAvailability(email);
        if (res.available) {
          setEmailStatus("valid");
          setEmailMsg("");
        } else {
          setEmailStatus("invalid");
          setEmailMsg(res.error || "Email is already registered");
        }
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setEmailStatus("idle");
      setEmailMsg("");
    }
  }, [email]);

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!name || usernameStatus !== "valid") {
        setError("Please provide a valid name and username.");
        return;
      }
      setStep(2);
    }
  };

  const prevStep = () => {
    setError("");
    if (step === 2) setStep(1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (usernameStatus === "invalid" || emailStatus === "invalid") {
      setError("Please fix the errors above");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.pending === false) {
          router.push("/login?verified=true");
        } else {
          setUserId(data.userId);
          setStep(3);
          setResendCooldown(60);
        }
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || otp.length !== 6) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await verifyUserOTP(userId, otp);
      if (res.success) {
        router.push("/login?verified=true");
      } else {
        setError(res.error || "Invalid OTP");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !userId) return;
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

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          {step === 1 && "Create Account"}
          {step === 2 && "Secure Account"}
          {step === 3 && "Verify Email"}
        </h2>
        <p className="text-white/60">
          {step === 1 && "Start your journey on SocialSphere"}
          {step === 2 && "Set up your login credentials"}
          {step === 3 && `We sent a code to ${email}`}
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <div className={`h-1.5 w-1/3 rounded-full transition-colors duration-500 ${step >= 1 ? "bg-amber-500" : "bg-white/10"}`} />
        <div className={`h-1.5 w-1/3 rounded-full transition-colors duration-500 ${step >= 2 ? "bg-amber-500" : "bg-white/10"}`} />
        <div className={`h-1.5 w-1/3 rounded-full transition-colors duration-500 ${step >= 3 ? "bg-amber-500" : "bg-white/10"}`} />
      </div>


      {error && (
        <div className="mb-6 text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <AuthInput
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
              />

              <div className="relative">
                <AuthInput
                  label="Username"
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="johndoe123"
                  error={usernameStatus === "invalid" ? usernameMsg : ""}
                />
                <div className="absolute right-4 top-[38px]">
                  {usernameStatus === "loading" && <Loader2 className="w-5 h-5 text-white/40 animate-spin" />}
                  {usernameStatus === "valid" && <Check className="w-5 h-5 text-emerald-400" />}
                  {usernameStatus === "invalid" && <X className="w-5 h-5 text-red-400" />}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!name || usernameStatus !== "valid"}
                  className="flex w-full justify-center items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3.5 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
              onSubmit={handleRegister}
            >
              <div className="relative">
                <AuthInput
                  label="Email address"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  error={emailStatus === "invalid" ? emailMsg : ""}
                />
                <div className="absolute right-4 top-[38px]">
                  {emailStatus === "loading" && <Loader2 className="w-5 h-5 text-white/40 animate-spin" />}
                  {emailStatus === "valid" && <Check className="w-5 h-5 text-emerald-400" />}
                  {emailStatus === "invalid" && <X className="w-5 h-5 text-red-400" />}
                </div>
              </div>

              <PasswordInput
                label="Password"
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
                placeholder="Confirm your password"
                error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : ""}
              />

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={loading || emailStatus !== "valid" || !password || password !== confirmPassword}
                  className="flex-1 flex justify-center items-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 flex flex-col items-center"
              onSubmit={handleVerify}
            >
              <OTPInput
                maxLength={6}
                value={otp}
                onChange={setOtp}
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

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex w-full justify-center items-center rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-3.5 text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Email"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors disabled:opacity-50"
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {step === 1 && (
        <div className="mt-8 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-amber-500 hover:text-amber-400 transition-colors">
            Sign in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
