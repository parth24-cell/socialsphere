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
    <section id="features" className="relative py-32 z-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Everything you need. <br/> Nothing you don't.
          </h2>
          <p className="text-zinc-400 text-lg">
            A premium suite of tools designed to elevate your social experience without the clutter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
            >
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-zinc-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
