"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-32 z-20 overflow-hidden border-t border-white/5 bg-[#030014]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-[#4F46E5]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight text-[#FAFAFA] mb-6 drop-shadow-2xl">
            Experience the next era of connection.
          </h2>
          <p className="text-xl text-[#A1A1AA] mb-12 font-light">
            Ready to step beyond the feed? Join SocialSphere today.
          </p>
          
          <Link href="/register" className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#FAFAFA] px-10 py-5 text-lg font-medium text-[#09090B] shadow-[0_0_40px_rgba(250,250,250,0.1)] hover:shadow-[0_0_60px_rgba(250,250,250,0.2)] transition-all overflow-hidden scale-100 hover:scale-105 active:scale-95 duration-300">
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
