"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-16 z-20">
      <div className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: "easeOut" }} // delay allows lamp to turn on first
          className="space-y-4 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] leading-tight">
            CONNECT.<br />
            CREATE.<br />
            INSPIRE.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5, ease: "easeOut" }}
          className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl"
        >
          The next-generation social platform for meaningful conversations, creators, and communities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Link href="/register" className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link href="#preview" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/5 transition-all">
            <Play className="h-4 w-4" />
            Watch Demo
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
