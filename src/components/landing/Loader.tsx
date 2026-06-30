"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800); // Wait a moment after reaching 100%
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030014]"
      style={{ pointerEvents: progress >= 100 ? "none" : "auto" }}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Particles / Loading Indicator */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 rounded-full border border-dashed border-[#4F46E5]/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-[#06B6D4]/30"
          />
          <Globe className="w-8 h-8 text-[#FAFAFA] opacity-50" />
        </div>

        {/* Text */}
        <div className="text-[#A1A1AA] text-sm tracking-widest uppercase mb-4 font-medium flex items-center gap-2">
          <span>Initializing Sphere</span>
          <span className="w-8 text-left">{Math.min(Math.round(progress), 100)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-[2px] bg-[#111216] overflow-hidden rounded-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
