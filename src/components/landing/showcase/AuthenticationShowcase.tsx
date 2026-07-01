"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Lock, Fingerprint, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function AuthenticationShowcase() {
  const [step, setStep] = useState(0);

  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-500, 500], [5, -5]);
  const rotateY = useTransform(mouseX, [-500, 500], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
     const t = setInterval(() => {
        setStep(s => (s + 1) % 4);
     }, 2500);
     return () => clearInterval(t);
  }, []);

  return (
    <div 
      className="relative w-full max-w-sm aspect-square flex items-center justify-center [perspective:1000px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-[#6366f1]/10 blur-[120px] rounded-full"
         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-[#020205]/40 backdrop-blur-2xl border border-white/5 border-t-white/10 border-l-white/10 rounded-[2.5rem] p-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 flex flex-col justify-center gap-6"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

        {/* Security Scan Line */}
        <motion.div 
           className="absolute left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_15px_#6366f1] z-20"
           animate={{ top: ["0%", "100%", "0%"] }}
           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Icon */}
        <motion.div 
          className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]"
          animate={{ scale: step === 3 ? 1.1 : 1, borderColor: step === 3 ? "rgba(16, 185, 129, 0.5)" : "rgba(99, 102, 241, 0.3)" }}
        >
           {step === 3 ? <ShieldCheck className="w-10 h-10 text-emerald-400" /> : <Lock className="w-10 h-10 text-indigo-400" />}
        </motion.div>

        <div className="text-center">
           <div className="text-white font-medium text-xl mb-2">
             {step === 0 ? "Email Login" : step === 1 ? "Check your email" : step === 2 ? "Verifying..." : "Authenticated"}
           </div>
           <div className="text-white/50 text-sm">
             {step === 3 ? "Session secured" : "admin@socialsphere.com"}
           </div>
        </div>

        {/* OTP Simulation */}
        <div className="w-full flex justify-center gap-2 mt-4">
           {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i} 
                className={`w-10 h-12 rounded-xl flex items-center justify-center text-xl font-mono
                  ${step === 3 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-white'}
                  border`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: step > 0 ? 1 : 0.3, 
                  y: step > 0 ? 0 : 10,
                  scale: (step === 2 && i % 2 === 0) ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.3, delay: step === 1 ? i * 0.1 : 0 }}
              >
                 {step >= 1 ? "•" : ""}
              </motion.div>
           ))}
        </div>

        {/* Biometric Prompt */}
        <motion.div 
          className="mt-auto flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10"
          animate={{ opacity: step === 3 ? 0 : 1 }}
        >
           <Fingerprint className="w-5 h-5 text-white/50" />
           <span className="text-white/50 text-sm">Use Passkey</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
