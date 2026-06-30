"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OTPInput } from "input-otp";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { checkUsernameAvailability, checkEmailAvailability, verifyUserOTP, sendVerificationOTP } from "@/actions/auth-v2";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
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
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          setEmailMsg("Email is available");
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

  const passwordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
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
        setUserId(data.userId);
        setStep(2);
        setResendCooldown(60);
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

  const strScore = passwordStrength();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-md border border-zinc-200 dark:border-zinc-800">
        
        {step === 1 && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Create an Account</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Join SocialSphere today</p>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</label>
                <div className="relative">
                  <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                  <div className="absolute right-3 top-2.5">
                    {usernameStatus === "loading" && <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />}
                    {usernameStatus === "valid" && <Check className="w-5 h-5 text-green-500" />}
                    {usernameStatus === "invalid" && <X className="w-5 h-5 text-red-500" />}
                  </div>
                </div>
                {usernameMsg && <p className={`mt-1 text-xs ${usernameStatus === "valid" ? "text-green-500" : "text-red-500"}`}>{usernameMsg}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email address</label>
                <div className="relative">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                  <div className="absolute right-3 top-2.5">
                    {emailStatus === "loading" && <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />}
                    {emailStatus === "valid" && <Check className="w-5 h-5 text-green-500" />}
                    {emailStatus === "invalid" && <X className="w-5 h-5 text-red-500" />}
                  </div>
                </div>
                {emailMsg && <p className={`mt-1 text-xs ${emailStatus === "valid" ? "text-green-500" : "text-red-500"}`}>{emailMsg}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
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

              <button type="submit" disabled={loading} className="mt-4 flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
              </button>
            </form>

            <div className="text-center text-sm mt-4">
              <span className="text-zinc-600 dark:text-zinc-400">Already have an account? </span>
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Verify Email</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">We've sent a 6-digit code to {email}</p>
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
          </>
        )}

      </div>
    </div>
  );
}
