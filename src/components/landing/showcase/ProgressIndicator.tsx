"use client";

import { useSphere, ActiveFeature } from "../SphereContext";
import { motion } from "framer-motion";

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

  if (!activeFeature) return null;

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-6 mix-blend-difference pointer-events-none">
      {SECTIONS.map((section) => {
        const isActive = activeFeature === section.id;
        return (
          <div key={section.id} className="flex items-center gap-4">
            <motion.div 
               className={`h-px bg-white ${isActive ? "w-12 opacity-100" : "w-4 opacity-30"}`} 
               animate={{ width: isActive ? 48 : 16, opacity: isActive ? 1 : 0.3 }}
               transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.span 
               className={`text-xs tracking-[0.2em] uppercase ${isActive ? "text-white font-medium shadow-white/50" : "text-white/30"}`}
               animate={{ opacity: isActive ? 1 : 0.3, x: isActive ? 0 : -10 }}
               transition={{ duration: 0.5, ease: "easeOut" }}
            >
               {section.label}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
