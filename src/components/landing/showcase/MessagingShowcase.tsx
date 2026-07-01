"use client";

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function MessagingShowcase() {
  const [messages, setMessages] = useState<number[]>([0]);
  const [isTyping, setIsTyping] = useState(true);

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
    const timer = setInterval(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, prev.length]);
      setTimeout(() => setIsTyping(true), 2000);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative w-full max-w-lg aspect-square flex items-center justify-center [perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full"
         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Parallax Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-[500px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-4 relative overflow-hidden z-10"
      >
        {/* Surface Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
             <div className="w-full h-full bg-black/50 rounded-full" />
          </div>
          <div>
            <div className="text-white font-medium text-lg">Sarah Jenkins</div>
            <div className="text-purple-400 text-sm flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
               </span>
               Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col gap-6 justify-end relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`p-4 rounded-3xl max-w-[80%] text-sm md:text-base leading-relaxed ${m % 2 === 0 ? "bg-white/5 text-white self-start rounded-tl-sm border border-white/5" : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white self-end rounded-tr-sm shadow-lg shadow-purple-500/20"}`}
              >
                {m % 2 === 0 ? "The new designs look incredible. Are we ready for the review?" : "Yes, I'll send over the prototype link in a second."}
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 p-4 rounded-3xl rounded-tl-sm self-start flex gap-1.5 items-center border border-white/5"
              >
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-white/40 rounded-full" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-white/40 rounded-full" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-white/40 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
