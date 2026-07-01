"use client";

import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { TrendingUp, Users, Activity, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export function CreatorToolsShowcase() {
  const [ticker, setTicker] = useState(12402);

  // Parallax & Spotlight Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-500, 500], [4, -4]);
  const rotateY = useTransform(mouseX, [-500, 500], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // For Rotation (centered)
    mouseX.set(x - rect.width / 2);
    mouseY.set(y - rect.height / 2);
    
    // For Spotlight (absolute)
    spotlightX.set(x);
    spotlightY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    spotlightX.set(0);
  };

  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, rgba(251,191,36,0.15), transparent 80%)`;

  useEffect(() => {
     let current = 12402;
     const t = setInterval(() => {
        current += Math.floor(Math.random() * 3) + 1;
        setTicker(current);
     }, 1500);
     return () => clearInterval(t);
  }, []);

  return (
    <div 
      className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-center [perspective:1000px] mx-auto group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-[#fbbf24]/10 blur-[120px] rounded-full group-hover:bg-[#fbbf24]/20 transition-colors duration-500"
         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-[#020205]/40 backdrop-blur-2xl border border-white/5 border-t-white/10 border-l-white/10 rounded-[2.5rem] p-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 flex flex-col gap-6"
      >
        <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" style={{ background: spotlightBackground }} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />

        {/* Header */}
        <div className="flex justify-between items-center relative z-10">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                 <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-white font-medium text-lg">Analytics Overview</div>
           </div>
           <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-1.5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <TrendingUp className="w-4 h-4" /> +24%
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
           <motion.div 
             whileHover={{ y: -2 }} 
             whileTap={{ scale: 0.95 }} 
             className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2 cursor-pointer hover:bg-white/10 transition-colors"
           >
              <div className="text-white/50 text-sm flex items-center gap-2">
                 <Users className="w-4 h-4" /> Total Audience
              </div>
              <div className="text-white text-3xl font-semibold tracking-tight">
                 {ticker.toLocaleString()}
              </div>
           </motion.div>
           <motion.div 
             whileHover={{ y: -2 }} 
             whileTap={{ scale: 0.95 }} 
             className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2 cursor-pointer hover:bg-white/10 transition-colors"
           >
              <div className="text-white/50 text-sm flex items-center gap-2">
                 <Activity className="w-4 h-4" /> Engagement Rate
              </div>
              <div className="text-white text-3xl font-semibold tracking-tight">
                 8.4%
              </div>
           </motion.div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex items-end justify-between gap-3 group">
           
           {/* SVG Line Graph overlay */}
           <svg className="absolute inset-0 w-full h-full preserve-3d pointer-events-none opacity-50 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path 
                d="M0,80 Q20,70 40,50 T80,30 T100,10" 
                fill="none" 
                stroke="#fbbf24" 
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
           </svg>

           {/* Animated Bars */}
           {[30, 45, 35, 60, 40, 75, 55, 90, 85].map((h, i) => (
              <motion.div 
                key={i} 
                className="w-full bg-amber-500/80 rounded-t-sm relative z-10 hover:bg-amber-400 transition-colors cursor-pointer origin-bottom"
                initial={{ height: 0 }}
                animate={{ height: [`${h}%`, `${h + (Math.random() * 10 - 5)}%`, `${h}%`] }}
                transition={{ duration: 4, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              />
           ))}
        </div>
      </motion.div>
    </div>
  );
}
