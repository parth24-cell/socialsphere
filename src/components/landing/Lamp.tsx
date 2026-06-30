"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export function Lamp() {
  const { scrollYProgress } = useScroll();

  // Smooth out the scroll progress for less jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate rotation based on scroll momentum (simple approximation using progress)
  // Lamp swings back and forth slightly as you scroll down
  const rotate = useTransform(smoothProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 5, -5, 3, -3, 0]);
  
  // Light intensity and blur changes as you scroll
  const lightOpacity = useTransform(smoothProgress, [0, 0.1, 1], [0.8, 1, 0.5]);
  const lightWidth = useTransform(smoothProgress, [0, 1], ["100%", "200%"]);
  const lightHeight = useTransform(smoothProgress, [0, 1], ["100%", "150%"]);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-0 w-full h-[100vh] pointer-events-none flex flex-col items-center overflow-hidden">
      <motion.div
        style={{ rotate, transformOrigin: "top center" }}
        className="relative flex flex-col items-center h-full w-[800px] max-w-[150vw]"
      >
        {/* Lamp Cord */}
        <div className="w-[2px] h-[15vh] bg-zinc-800" />
        
        {/* Lamp Fixture */}
        <div className="w-16 h-8 bg-zinc-900 rounded-t-full border-b border-zinc-700 relative z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4 bg-zinc-800 rounded-b-md" />
        </div>

        {/* Light Beam */}
        <motion.div
          style={{ 
            opacity: lightOpacity,
            width: lightWidth,
            height: lightHeight
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[15vh] left-1/2 -translate-x-1/2"
        >
          {/* Main Cone */}
          <div 
            className="absolute inset-0"
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent 120deg, rgba(255, 230, 180, 0.1) 150deg, rgba(255, 230, 180, 0.1) 210deg, transparent 240deg)",
              filter: "blur(40px)",
              maskImage: "linear-gradient(to bottom, black 10%, transparent 80%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 80%)"
            }}
          />
          {/* Inner intense glow */}
          <div 
            className="absolute top-0 left-1/4 w-1/2 h-full"
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(255, 230, 180, 0.25) 175deg, rgba(255, 230, 180, 0.25) 185deg, transparent 200deg)",
              filter: "blur(20px)",
              maskImage: "linear-gradient(to bottom, black 5%, transparent 60%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 5%, transparent 60%)"
            }}
          />
          
          {/* Lens flare / Bulb glow */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#ffe6b4] rounded-full blur-2xl opacity-90" />
        </motion.div>
      </motion.div>
    </div>
  );
}
