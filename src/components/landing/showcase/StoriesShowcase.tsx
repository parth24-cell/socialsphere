"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart } from "lucide-react";

export function StoriesShowcase() {
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

  return (
    <div 
      className="relative w-full max-w-sm aspect-[9/16] flex items-center justify-center [perspective:1000px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full"
         animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Parallax Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 shadow-2xl relative overflow-hidden z-10 flex flex-col"
      >
        {/* Animated Gradient Background */}
        <motion.div 
           className="absolute inset-0 bg-gradient-to-b from-blue-600/30 via-transparent to-transparent opacity-50"
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Progress Bars */}
        <div className="flex gap-2 mb-6 relative z-10">
          <motion.div className="h-1 bg-white/20 rounded-full flex-1 overflow-hidden">
             <motion.div 
                className="h-full bg-white shadow-[0_0_10px_white]" 
                animate={{ width: ["0%", "100%"] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }} 
             />
          </motion.div>
          <div className="h-1 bg-white/20 rounded-full flex-1" />
          <div className="h-1 bg-white/20 rounded-full flex-1" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <svg className="w-10 h-10 -rotate-90">
               <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
               <motion.circle 
                  cx="20" cy="20" r="18" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="113"
                  animate={{ strokeDashoffset: [113, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
               />
            </svg>
            <div className="absolute inset-0 m-1 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full" />
          </div>
          <div>
            <div className="text-white font-medium text-sm drop-shadow-md">Alex Chen</div>
            <div className="text-white/60 text-xs drop-shadow-md">2h ago</div>
          </div>
        </div>

        {/* Story Content Placeholder */}
        <div className="flex-1 my-4 rounded-2xl bg-gradient-to-tr from-white/5 to-white/10 border border-white/5 relative overflow-hidden">
           {/* Glare effect */}
           <motion.div 
             className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
             animate={{ rotate: [0, 45, 0] }}
             transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
           />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-4 relative z-10">
           <div className="flex-1 h-12 rounded-full border border-white/20 bg-black/20 flex items-center px-4 text-white/50 text-sm backdrop-blur-md">
              Send message...
           </div>
           <motion.div 
             className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md text-white/80"
             whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.5)" }}
             whileTap={{ scale: 0.9 }}
           >
              <Heart className="w-6 h-6" />
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
