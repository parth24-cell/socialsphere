"use client";

import { useSphere, ActiveFeature } from "../SphereContext";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

const SECTIONS: { id: ActiveFeature; label: string }[] = [
  { id: "messaging", label: "01 Messaging" },
  { id: "stories", label: "02 Stories" },
  { id: "feed", label: "03 Feed" },
  { id: "communities", label: "04 Communities" },
  { id: "auth", label: "05 Security" },
  { id: "creator", label: "06 Creator" },
  { id: "ai", label: "07 AI" },
  { id: "cta", label: "08 Join" }
];

export function ProgressIndicator() {
  const { activeFeature } = useSphere();
  const { scrollYProgress } = useScroll();
  
  // Smooth the scroll progress to avoid jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const activeIndex = SECTIONS.findIndex(s => s.id === activeFeature);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col mix-blend-difference pointer-events-none">
      
      {/* Background Track Line */}
      <div className="absolute left-[1px] top-4 bottom-4 w-[1px] bg-white/10" />
      
      {/* Active Scroll Line */}
      <motion.div 
        className="absolute left-[1px] top-4 w-[1px] bg-white origin-top shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{ scaleY: smoothProgress, bottom: 16 }}
      />

      <div className="flex flex-col gap-8 relative z-10 py-4">
        {SECTIONS.map((section, idx) => {
          const isActive = activeFeature === section.id;
          const isPast = idx < activeIndex;

          return (
            <div key={section.id} className="flex items-center gap-4 relative">
              {/* Node Point */}
              <motion.div 
                className={`w-[3px] h-[3px] rounded-full bg-white relative z-20`}
                animate={{ 
                  scale: isActive ? 2 : 1, 
                  opacity: isActive || isPast ? 1 : 0.3,
                  boxShadow: isActive ? '0 0 10px 2px rgba(255,255,255,0.5)' : 'none'
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              
              {/* Active Indicator Line */}
              <motion.div 
                 className="h-px bg-white" 
                 animate={{ 
                    width: isActive ? 32 : 0, 
                    opacity: isActive ? 1 : 0 
                 }}
                 initial={{ width: 0 }}
                 transition={{ duration: 0.5, ease: "easeOut" }}
              />

              <motion.span 
                 className="text-[10px] tracking-[0.25em] uppercase absolute left-8 whitespace-nowrap"
                 animate={{ 
                    opacity: isActive ? 1 : 0.3, 
                    x: isActive ? 8 : 0,
                    color: isActive || isPast ? "#FFFFFF" : "rgba(255,255,255,0.3)"
                 }}
                 transition={{ duration: 0.5, ease: "easeOut" }}
              >
                 {section.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
