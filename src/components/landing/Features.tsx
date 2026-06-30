"use client";

import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Users, MessageSquare, Shield, Search } from "lucide-react";

const features = [
  {
    title: "AI Feed",
    description: "Smart algorithms that understand what you want to see, delivering perfectly curated content.",
    icon: Sparkles
  },
  {
    title: "Stories",
    description: "Share fleeting moments with your community through high-quality 24-hour stories.",
    icon: ImageIcon
  },
  {
    title: "Communities",
    description: "Find your tribe. Join specialized groups tailored to your exact interests.",
    icon: Users
  },
  {
    title: "Real-Time Messaging",
    description: "Connect instantly with friends through our ultra-low latency chat architecture.",
    icon: MessageSquare
  },
  {
    title: "Privacy First",
    description: "Granular controls over who sees what. Your data remains yours, always.",
    icon: Shield
  },
  {
    title: "Smart Search",
    description: "Find posts, people, and topics instantly with our lightning-fast search engine.",
    icon: Search
  }
];

export function Features() {
  return (
    <section id="features" className="relative py-40 z-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            Everything you need. <br/> Nothing you don't.
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-light">
            A premium suite of tools designed to elevate your social experience without the clutter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 1, 
                delay: idx * 0.1, 
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className="group rounded-3xl bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl transition-colors hover:bg-zinc-800/50 hover:border-white/10"
            >
              <div className="h-14 w-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 ease-out">
                <feature.icon className="h-7 w-7 text-zinc-300 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
