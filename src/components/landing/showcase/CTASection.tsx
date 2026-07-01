"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useSphere } from "../SphereContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-40% 0px -40% 0px" });
  const { setActiveFeature } = useSphere();

  useEffect(() => {
    if (isInView) {
      setActiveFeature("cta");
    }
  }, [isInView, setActiveFeature]);

  return (
    <div 
      ref={containerRef} 
      id="section-cta"
      className="min-h-[100vh] w-full flex items-center justify-center py-24 relative z-10"
    >
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ margin: "-20%" }}
        className="container mx-auto px-6 text-center max-w-4xl flex flex-col items-center"
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight mb-8 drop-shadow-2xl">
          Every connection begins with one click.
        </h2>
        
        <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-2xl mb-12">
          Join SocialSphere and experience conversations, stories, communities, and creators inside one beautifully connected platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
           <Link href="/register" className="group w-full sm:w-auto">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="relative overflow-hidden rounded-full bg-white text-black px-8 py-4 flex items-center justify-center gap-2 font-medium text-lg w-full"
             >
                Join SocialSphere
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
             </motion.div>
           </Link>
           
           <Link href="/login" className="text-white/60 hover:text-white transition-colors font-medium text-lg">
             Already have an account? Sign In
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
