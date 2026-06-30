"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-32 z-20 overflow-hidden border-t border-white/5 bg-gradient-to-b from-black to-zinc-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-2xl">
            Ready to Join SocialSphere?
          </h2>
          <p className="text-xl text-zinc-400 mb-12">
            The next generation of social interaction awaits. Sign up in seconds.
          </p>
          
          <Link href="/register" className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-10 py-5 text-lg font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:shadow-[0_0_50px_rgba(79,70,229,0.8)] hover:bg-indigo-500 transition-all overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Create Your Account
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
