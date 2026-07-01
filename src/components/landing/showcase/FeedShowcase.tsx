"use client";

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export function FeedShowcase() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-500, 500], [4, -4]);
  const rotateY = useTransform(mouseX, [-500, 500], [-4, 4]);

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
         setLiked(l => !l);
         setTimeout(() => setBookmarked(b => !b), 1000);
     }, 4000);
     return () => clearInterval(t);
  }, []);

  return (
    <div 
      className="relative w-full max-w-lg aspect-[4/5] flex items-center justify-center [perspective:1000px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full"
         animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Scroll Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden relative z-10 flex flex-col gap-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        {/* Top Navbar */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
           <div className="text-white font-medium text-lg tracking-wide">Feed</div>
           <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10" />
        </div>

        {/* Post Card */}
        <motion.div 
           className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col gap-4 relative z-10 shadow-xl"
           animate={{ y: [20, 0] }}
           transition={{ duration: 1, ease: "easeOut" }}
        >
           {/* Post Header */}
           <div className="flex justify-between items-start">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-[1px]">
                   <div className="w-full h-full bg-black/50 rounded-full" />
                </div>
                <div>
                   <div className="text-white font-medium text-sm">David Miller</div>
                   <div className="text-white/40 text-xs">2 hours ago</div>
                </div>
             </div>
             <MoreHorizontal className="w-5 h-5 text-white/40" />
           </div>

           {/* Post Content */}
           <div className="text-white/80 text-sm leading-relaxed">
             Just finished the new design system. The contrast ratios are looking incredible. Can't wait to share the final polished version with everyone! ✨
           </div>

           {/* Post Image Placeholder */}
           <div className="w-full h-32 rounded-2xl bg-gradient-to-tr from-white/5 to-white/10 border border-white/5 relative overflow-hidden group">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: [0, 45, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <AnimatePresence>
                 {liked && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                       <Heart className="w-16 h-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" fill="white" />
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Actions */}
           <div className="flex gap-6 pt-2">
              <motion.div className="flex gap-2 items-center text-white/50 cursor-pointer" animate={liked ? { color: "#ef4444" } : {}}>
                 <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Heart className="w-5 h-5" fill={liked ? "#ef4444" : "transparent"} color={liked ? "#ef4444" : "currentColor"} />
                 </motion.div>
                 <span className="text-sm font-medium">{liked ? 125 : 124}</span>
              </motion.div>
              
              <div className="flex gap-2 items-center text-white/50 cursor-pointer hover:text-white/80 transition-colors">
                 <MessageCircle className="w-5 h-5" />
                 <span className="text-sm font-medium">24</span>
              </div>

              <div className="flex gap-2 items-center text-white/50 cursor-pointer hover:text-white/80 transition-colors">
                 <Share2 className="w-5 h-5" />
              </div>

              <motion.div className="ml-auto text-white/50 cursor-pointer" animate={bookmarked ? { color: "#3b82f6" } : {}}>
                 <motion.div animate={bookmarked ? { scale: [1, 1.3, 1] } : {}} transition={{ type: "spring" }}>
                    <Bookmark className="w-5 h-5" fill={bookmarked ? "#3b82f6" : "transparent"} color={bookmarked ? "#3b82f6" : "currentColor"} />
                 </motion.div>
              </motion.div>
           </div>
        </motion.div>

        {/* Next Post Skeleton */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex flex-col gap-4 relative z-10 opacity-50 translate-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5" />
              <div className="flex flex-col gap-2">
                 <div className="w-24 h-3 bg-white/10 rounded-full" />
                 <div className="w-16 h-2 bg-white/5 rounded-full" />
              </div>
           </div>
           <div className="w-full h-16 bg-white/5 rounded-xl" />
        </div>
      </motion.div>
    </div>
  );
}
