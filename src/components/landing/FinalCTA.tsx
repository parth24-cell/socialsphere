"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative z-20 py-32 overflow-hidden bg-black/20 backdrop-blur-md border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(251,191,36,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 mb-6">
            Ready to build the<br />future of connection?
          </h2>
          <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light mb-12">
            Join thousands of forward-thinking teams already using SocialSphere to engineer premium digital experiences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 items-center mb-16"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-medium text-lg overflow-hidden flex items-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
               Get Started for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium text-lg transition-colors"
          >
            Book a Demo
          </motion.button>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-6 md:gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
        >
           {[
             "No credit card required",
             "SOC2 Type II Certified",
             "99.99% Uptime SLA",
             "24/7 Premium Support"
           ].map((trust, i) => (
             <div key={i} className="flex items-center gap-2 text-white/40 text-sm font-medium">
               <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
               {trust}
             </div>
           ))}
        </motion.div>

      </div>
    </section>
  );
}
