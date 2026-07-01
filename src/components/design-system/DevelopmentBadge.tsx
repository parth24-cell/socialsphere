"use client";

import { motion } from "framer-motion";

export function DevelopmentBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-[9999] flex items-center justify-center gap-2 text-amber-500 text-xs font-medium bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.15)] backdrop-blur-md pointer-events-none"
    >
      <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      Development Mode
    </motion.div>
  );
}
