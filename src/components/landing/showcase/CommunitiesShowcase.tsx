"use client";

import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { Users } from "lucide-react";

export function CommunitiesShowcase() {
  // Parallax & Spotlight Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-500, 500], [5, -5]);
  const rotateY = useTransform(mouseX, [-500, 500], [-5, 5]);

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

  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, rgba(6,182,212,0.15), transparent 80%)`;

  return (
    <div 
      className="relative w-full max-w-lg aspect-square flex items-center justify-center [perspective:1000px] mx-auto group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-[#06b6d4]/10 blur-[120px] rounded-full group-hover:bg-[#06b6d4]/20 transition-colors duration-500"
         animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
         transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-[#020205]/40 backdrop-blur-2xl border border-white/5 border-t-white/10 border-l-white/10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 flex items-center justify-center"
      >
        <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" style={{ background: spotlightBackground }} />
        <div className="absolute inset-0 bg-gradient-to-tl from-white/5 to-transparent pointer-events-none" />

        {/* SVG Connection Lines */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-40">
           <motion.circle 
              cx="50" cy="50" r="30" 
              fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="4 4" 
              animate={{ rotate: 360 }} 
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
              style={{ transformOrigin: "50px 50px" }}
           />
           <motion.circle 
              cx="50" cy="50" r="40" 
              fill="none" stroke="#06b6d4" strokeWidth="0.2" strokeDasharray="2 6" 
              animate={{ rotate: -360 }} 
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
              style={{ transformOrigin: "50px 50px" }}
           />
        </svg>

        {/* Floating Avatars */}
        {[...Array(6)].map((_, i) => {
           const angle = (i / 6) * Math.PI * 2;
           // Orbit radius
           const r = i % 2 === 0 ? 30 : 40;
           return (
              <motion.div 
                key={i}
                className="absolute w-12 h-12 rounded-full border border-cyan-500/50 bg-black/80 backdrop-blur-md overflow-hidden flex items-center justify-center"
                animate={{ 
                   x: [Math.cos(angle) * r, Math.cos(angle + Math.PI) * r, Math.cos(angle) * r], 
                   y: [Math.sin(angle) * r, Math.sin(angle + Math.PI) * r, Math.sin(angle) * r],
                   scale: [1, 1.1, 1]
                }}
                transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
                style={{
                   // Convert relative SVG space to absolute percentage roughly
                   left: "calc(50% - 24px)",
                   top: "calc(50% - 24px)",
                }}
              >
                 <div className="w-full h-full bg-cyan-500/20" />
              </motion.div>
           )
        })}

        {/* Central Community Hub */}
        <motion.div 
          className="w-20 h-20 rounded-2xl rotate-45 bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center z-10 shadow-[0_0_40px_rgba(6,182,212,0.6)]"
          animate={{ scale: [1, 1.1, 1], rotate: [45, 45, 45] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
           <Users className="w-8 h-8 text-white -rotate-45" />
        </motion.div>
      </motion.div>
    </div>
  );
}
