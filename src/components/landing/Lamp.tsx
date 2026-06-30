"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Lamp() {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    // Light flickers and turns on after a delay
    const timer = setTimeout(() => {
      setIsOn(true);
    }, 1500); // 1.5s delay before light turns on
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full h-[80vh] pointer-events-none flex flex-col items-center overflow-hidden">
      <motion.div
        initial={{ rotate: -5, originY: 0 }}
        animate={{ rotate: 5 }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 4,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center h-full w-[800px]"
      >
        {/* Lamp Cord */}
        <div className="w-[2px] h-[15vh] bg-zinc-800" />
        
        {/* Lamp Fixture */}
        <div className="w-16 h-8 bg-zinc-900 rounded-t-full border-b border-zinc-700 relative z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4 bg-zinc-800 rounded-b-md" />
        </div>

        {/* Light Beam */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOn ? [0, 0.5, 0, 1] : 0 }}
          transition={{ duration: isOn ? 0.8 : 0, times: [0, 0.2, 0.4, 1] }}
          className="absolute top-[15vh] left-1/2 -translate-x-1/2 w-full h-full"
        >
          {/* Main Cone */}
          <div 
            className="w-full h-full"
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent 120deg, rgba(255, 230, 180, 0.15) 150deg, rgba(255, 230, 180, 0.15) 210deg, transparent 240deg)",
              filter: "blur(20px)",
              maskImage: "linear-gradient(to bottom, black 10%, transparent 90%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 90%)"
            }}
          />
          {/* Inner intense glow */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full"
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(255, 230, 180, 0.3) 175deg, rgba(255, 230, 180, 0.3) 185deg, transparent 200deg)",
              filter: "blur(10px)",
              maskImage: "linear-gradient(to bottom, black 5%, transparent 60%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 5%, transparent 60%)"
            }}
          />
          
          {/* Lens flare / Bulb glow */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#ffe6b4] rounded-full blur-xl opacity-80" />
        </motion.div>
      </motion.div>
    </div>
  );
}
