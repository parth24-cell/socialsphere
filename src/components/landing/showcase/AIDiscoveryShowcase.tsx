"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, Hash, UserPlus, ShieldPlus } from "lucide-react";

export function AIDiscoveryShowcase() {
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
      className="relative w-full max-w-lg aspect-[4/5] flex items-center justify-center [perspective:1000px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-cyan-500/20 blur-[120px] rounded-full"
         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
         transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
         className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full translate-x-10 translate-y-10"
         animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Parallax Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden z-10 flex flex-col gap-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        {/* Coming Soon Badge */}
        <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 border border-white/10 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
           <Sparkles className="w-4 h-4 text-amber-400" />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 text-xs font-semibold tracking-wider">COMING SOON</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 relative z-10 mt-2">
           <div className="text-white font-medium text-2xl tracking-tight">For You</div>
        </div>

        {/* AI Recommendations */}
        <div className="flex flex-col gap-4 relative z-10 flex-1">
           
           {/* Recommendation 1 */}
           <motion.div 
             className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 items-center group cursor-pointer hover:bg-white/10 transition-colors"
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             viewport={{ once: true }}
           >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                 <UserPlus className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                 <div className="text-white font-medium text-sm">Design Engineers</div>
                 <div className="text-white/40 text-xs">Based on your activity</div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 transition-colors">
                 <span className="text-white/50 text-xs">+</span>
              </div>
           </motion.div>

           {/* Recommendation 2 */}
           <motion.div 
             className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 items-center group cursor-pointer hover:bg-white/10 transition-colors"
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             viewport={{ once: true }}
           >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                 <Hash className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                 <div className="text-white font-medium text-sm">#FutureOfWork</div>
                 <div className="text-white/40 text-xs">Trending in your network</div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-400/50 transition-colors">
                 <span className="text-white/50 text-xs">↗</span>
              </div>
           </motion.div>

           {/* Recommendation 3 */}
           <motion.div 
             className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 items-center group cursor-pointer hover:bg-white/10 transition-colors"
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             viewport={{ once: true }}
           >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                 <ShieldPlus className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                 <div className="text-white font-medium text-sm">Figma Mastery</div>
                 <div className="text-white/40 text-xs">Suggested Community</div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-purple-400/50 transition-colors">
                 <span className="text-white/50 text-xs">Join</span>
              </div>
           </motion.div>

        </div>
        
        {/* Magic Glow effect scanning */}
        <motion.div 
           className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent w-full h-[200%] -translate-y-1/2 pointer-events-none z-20 mix-blend-overlay"
           animate={{ top: ["0%", "100%", "0%"] }}
           transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}
