"use client";

import { motion, useMotionValue, useTransform, AnimatePresence, useMotionTemplate } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Send, MoreHorizontal, X } from "lucide-react";

const STORIES = [
  { id: 1, img: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)", user: "Alex Chen", time: "2h" },
  { id: 2, img: "linear-gradient(to bottom right, #f43f5e, #f97316)", user: "Alex Chen", time: "2h" },
  { id: 3, img: "linear-gradient(to bottom right, #10b981, #3b82f6)", user: "Alex Chen", time: "2h" }
];

export function StoriesShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

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

  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${spotlightX}px ${spotlightY}px, rgba(59,130,246,0.15), transparent 80%)`;

  // Story Loop Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
           setCurrentIndex(c => (c + 1) % STORIES.length);
           return 0;
        }
        return p + 1; // 100 steps over 3 seconds = 30ms interval
      });
    }, 30);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative w-full max-w-sm aspect-[9/16] flex items-center justify-center [perspective:1000px] mx-auto group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-[#3b82f6]/10 blur-[120px] rounded-full group-hover:bg-[#3b82f6]/20 transition-colors duration-500"
         animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
         transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Phone Frame */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-[#020205]/40 backdrop-blur-2xl border border-white/5 border-t-white/10 border-l-white/10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden relative z-10 flex flex-col"
      >
         <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" style={{ background: spotlightBackground }} />
         <AnimatePresence initial={false}>
            <motion.div 
               key={currentIndex}
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
               className="absolute inset-0 z-0"
               style={{ background: STORIES[currentIndex].img }}
            />
         </AnimatePresence>
         
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />

         {/* Top Bar */}
         <div className="p-4 relative z-20 flex flex-col gap-3">
            {/* Progress Bars */}
            <div className="flex gap-1.5 w-full">
               {STORIES.map((_, i) => (
                  <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-white transition-all duration-75"
                        style={{ 
                           width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%' 
                        }}
                     />
                  </div>
               ))}
            </div>

            {/* User Info */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md p-[2px] border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                     <div className="w-full h-full bg-white/20 rounded-full" />
                  </div>
                  <span className="text-white font-medium text-sm drop-shadow-md">{STORIES[currentIndex].user}</span>
                  <span className="text-white/60 text-xs drop-shadow-md">{STORIES[currentIndex].time}</span>
               </div>
               <div className="flex items-center gap-3 text-white">
                  <MoreHorizontal className="w-5 h-5 drop-shadow-md" />
                  <X className="w-6 h-6 drop-shadow-md" />
               </div>
            </div>
         </div>

         <div className="mt-auto p-4 relative z-20">
            {/* Input & Actions */}
            <div className="flex items-center gap-3">
               <div className="flex-1 h-12 rounded-full border border-white/30 backdrop-blur-md bg-black/20 px-4 flex items-center">
                  <span className="text-white/60 text-sm">Send message</span>
               </div>
               <motion.div 
                 className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                 whileTap={{ scale: 0.9 }}
               >
                  <Heart className="w-7 h-7 text-white drop-shadow-md" />
               </motion.div>
               <motion.div 
                 className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                 whileTap={{ scale: 0.9 }}
               >
                  <Send className="w-6 h-6 text-white drop-shadow-md -rotate-45 mb-1" />
               </motion.div>
            </div>
         </div>
      </motion.div>
    </div>
  );
}
