"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hero section fades out and moves up as you scroll down
  const y = useTransform(smoothProgress, [0, 0.2], [0, -150]);
  const opacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2], [1, 0.95]);
  const filter = useTransform(smoothProgress, [0, 0.15], ["blur(0px)", "blur(10px)"]);

  // Staggered text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 z-10">
      <motion.div 
        style={{ y, opacity, scale, filter }}
        className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 max-w-4xl"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] leading-[0.9]"
          >
            CONNECT.
          </motion.h1>
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] leading-[0.9]"
          >
            CREATE.
          </motion.h1>
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] leading-[0.9]"
          >
            INSPIRE.
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
          className="mt-12 text-lg md:text-xl text-zinc-400 max-w-2xl font-light tracking-wide"
        >
          The next-generation social platform for meaningful conversations, creators, and communities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mt-16 flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Link href="/register" className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all overflow-hidden scale-100 hover:scale-105 active:scale-95 duration-300">
            <span className="relative z-10 flex items-center gap-2">
              Enter Platform
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link href="#preview" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-8 py-4 text-base font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all scale-100 hover:scale-105 active:scale-95 duration-300 backdrop-blur-md">
            <Play className="h-4 w-4" />
            Watch Film
          </Link>
        </motion.div>

      </motion.div>
    </section>
  );
}
