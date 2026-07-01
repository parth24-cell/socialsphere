"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero({ isLoaded }: { isLoaded: boolean }) {
  const baseDelay = isLoaded ? 0.5 : 5; 

  // Magnetic button setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const magneticX = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 150, damping: 15, mass: 0.1 });
  const magneticY = useSpring(useTransform(mouseY, [-1, 1], [-15, 15]), { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 2);
    mouseY.set(y * 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-24 pb-16 z-10 overflow-hidden">
      
      {/* Subtle Background Movement */}
      <motion.div 
         className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none"
         animate={{ y: ["-10%", "10%", "-10%"] }}
         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center justify-center h-full relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={isLoaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.5, delay: baseDelay, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 max-w-4xl relative"
        >
          {/* Ambient Occlusion Mask for Hero Text Readability */}
          <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,rgba(2,2,5,0.6)_0%,transparent_70%)] scale-150 origin-center" />
          
          {/* Floating Letters */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#FAFAFA] leading-[1.1] drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            Connecting<br />
            people<br />
            beyond<br />
            the feed.
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: baseDelay + 0.5, ease: "easeOut" }}
          className="mt-8 text-lg md:text-xl text-[#A1A1AA] max-w-2xl font-light drop-shadow-md relative z-10"
        >
          Build authentic relationships through conversations, stories, and communities—all in a beautifully designed, real-time experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: baseDelay + 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div style={{ x: magneticX, y: magneticY }}>
             <Link href="/register" className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#FAFAFA] px-10 py-5 text-base font-medium text-[#09090B] shadow-[0_0_40px_rgba(250,250,250,0.15)] transition-all overflow-hidden duration-300">
               <span className="relative z-10 flex items-center gap-2">
                 Join SocialSphere
                 <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowRight className="h-4 w-4" />
                 </motion.div>
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
             </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
