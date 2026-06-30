"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { MessageSquare, Image as ImageIcon, Users, Shield, Sparkles, PenTool } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    title: "Real-Time Messaging",
    description: "Instant, ultra-low latency connections.",
    icon: MessageSquare,
    position: "md:col-start-1 md:col-span-4",
    parallax: [50, -50]
  },
  {
    title: "Stories",
    description: "Share fleeting moments with high fidelity.",
    icon: ImageIcon,
    position: "md:col-start-8 md:col-span-5",
    parallax: [100, -100]
  },
  {
    title: "Communities",
    description: "Find your tribe in specialized groups.",
    icon: Users,
    position: "md:col-start-3 md:col-span-4",
    parallax: [30, -30]
  },
  {
    title: "Secure Authentication",
    description: "Enterprise-grade security, protecting your data.",
    icon: Shield,
    position: "md:col-start-7 md:col-span-5",
    parallax: [80, -80]
  },
  {
    title: "AI Discovery (Coming Soon)",
    description: "Intelligent curation without the noise.",
    icon: Sparkles,
    position: "md:col-start-2 md:col-span-5",
    parallax: [60, -60]
  },
  {
    title: "Creator Tools (Coming Soon)",
    description: "Everything you need to build your audience.",
    icon: PenTool,
    position: "md:col-start-8 md:col-span-4",
    parallax: [40, -40]
  }
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} id="features" className="relative py-40 z-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-32 gap-x-6">
          {features.map((feature, idx) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y = useTransform(scrollYProgress, [0, 1], feature.parallax);
            
            return (
              <motion.div
                key={feature.title}
                style={{ y }}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={`${feature.position} group relative overflow-hidden rounded-[2rem] bg-[#141414]/40 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 p-8 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-[#141414]/60 hover:border-white/10 flex flex-col justify-between min-h-[250px] ring-1 ring-white/5 inset-0`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="h-12 w-12 rounded-full bg-[#111216]/80 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 group-hover:border-[#F59E0B]/30 transition-all duration-500 ease-out shadow-inner">
                    <feature.icon className="h-5 w-5 text-[#FBBF24] group-hover:text-[#F59E0B] transition-colors duration-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-[#FAFAFA] mb-2">{feature.title}</h3>
                    <p className="text-[#A1A1AA] font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
