"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero({ isLoaded }: { isLoaded: boolean }) {
  // Wait until loading is complete to trigger entry animations
  const baseDelay = isLoaded ? 0.5 : 5; // Long delay if not loaded yet, just in case

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-24 pb-16 z-10">
      <div className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center justify-center h-full">
        
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={isLoaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.5, delay: baseDelay, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-[#FAFAFA] leading-[1.1]">
            Connecting<br />
            people<br />
            beyond<br />
            the feed.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: baseDelay + 0.5, ease: "easeOut" }}
          className="mt-8 text-lg md:text-xl text-[#A1A1AA] max-w-2xl font-light"
        >
          Build authentic relationships through conversations, stories, and communities—all in a beautifully designed, real-time experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: baseDelay + 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <Link href="/register" className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#FAFAFA] px-10 py-5 text-base font-medium text-[#09090B] shadow-[0_0_40px_rgba(250,250,250,0.15)] hover:shadow-[0_0_60px_rgba(250,250,250,0.25)] transition-all overflow-hidden scale-100 hover:scale-105 active:scale-95 duration-300">
            <span className="relative z-10 flex items-center gap-2">
              Join SocialSphere
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
