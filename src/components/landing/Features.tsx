"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MessageSquare, Image as ImageIcon, Users, Shield, Sparkles, PenTool } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const features = [
  {
    title: "Real-Time Messaging",
    description: "Instant, ultra-low latency connections.",
    icon: MessageSquare,
    position: "md:col-start-1 md:col-span-4",
    parallax: [50, -50],
    glow: "rgba(217, 70, 239, 0.15)",
    borderGlow: "rgba(217, 70, 239, 0.4)",
    iconColor: "#d946ef"
  },
  {
    title: "Stories",
    description: "Share fleeting moments with high fidelity.",
    icon: ImageIcon,
    position: "md:col-start-8 md:col-span-5",
    parallax: [100, -100],
    glow: "rgba(59, 130, 246, 0.15)",
    borderGlow: "rgba(59, 130, 246, 0.4)",
    iconColor: "#60a5fa"
  },
  {
    title: "Communities",
    description: "Find your tribe in specialized groups.",
    icon: Users,
    position: "md:col-start-3 md:col-span-4",
    parallax: [30, -30],
    glow: "rgba(6, 182, 212, 0.15)",
    borderGlow: "rgba(6, 182, 212, 0.4)",
    iconColor: "#22d3ee"
  },
  {
    title: "Secure Authentication",
    description: "Enterprise-grade security, protecting your data.",
    icon: Shield,
    position: "md:col-start-7 md:col-span-5",
    parallax: [80, -80],
    glow: "rgba(139, 92, 246, 0.15)",
    borderGlow: "rgba(139, 92, 246, 0.4)",
    iconColor: "#a78bfa"
  },
  {
    title: "AI Discovery (Coming Soon)",
    description: "Intelligent curation without the noise.",
    icon: Sparkles,
    position: "md:col-start-2 md:col-span-5",
    parallax: [60, -60],
    glow: "rgba(245, 158, 11, 0.15)",
    borderGlow: "rgba(245, 158, 11, 0.4)",
    iconColor: "#fbbf24"
  },
  {
    title: "Creator Tools (Coming Soon)",
    description: "Everything you need to build your audience.",
    icon: PenTool,
    position: "md:col-start-8 md:col-span-4",
    parallax: [40, -40],
    glow: "rgba(236, 72, 153, 0.15)",
    borderGlow: "rgba(236, 72, 153, 0.4)",
    iconColor: "#f472b6"
  }
];

function Particles({ color }: { color: string }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            background: color,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            filter: `blur(0.5px)`,
            boxShadow: `0 0 6px ${color}`
          }}
        />
      ))}
    </div>
  );
}

function FeatureCard({ feature, scrollYProgress }: { feature: typeof features[0]; scrollYProgress: any }) {
  const y = useTransform(scrollYProgress, [0, 1], feature.parallax);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const idleBorderGlow = `inset 0 0 2px rgba(255,255,255,0.05), 0 0 0px transparent`;
  const activeBorderGlow = `inset 0 0 10px ${feature.borderGlow}, 0 0 20px ${feature.glow}`;

  return (
    <motion.div
      style={{ y }}
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={feature.position + " relative z-10"}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="group relative overflow-hidden rounded-[2rem] flex flex-col justify-between min-h-[250px] w-full h-full"
        style={{
          background: "linear-gradient(180deg, rgba(32,32,42,0.95), rgba(18,18,28,0.92))",
          boxShadow: `
            0 25px 50px -12px rgba(0,0,0,0.8),
            inset 0 1px 1px rgba(255,255,255,0.15),
            inset 0 -1px 1px rgba(255,255,255,0.02),
            inset 1px 0 1px rgba(255,255,255,0.02),
            inset -1px 0 1px rgba(255,255,255,0.02)
          `,
        }}
      >
        {/* Soft animated border */}
        <motion.div 
          className="absolute inset-0 rounded-[2rem] border border-white/[0.08] pointer-events-none"
          animate={{
            boxShadow: isHovered ? activeBorderGlow : idleBorderGlow,
            borderColor: isHovered ? feature.borderGlow : "rgba(255,255,255,0.08)"
          }}
          transition={{ duration: 0.35 }}
        />

        {/* Pulsing idle border glow */}
        {!isHovered && (
          <motion.div
            className="absolute inset-0 rounded-[2rem] pointer-events-none"
            animate={{
              boxShadow: [
                `inset 0 0 0px ${feature.glow}`,
                `inset 0 0 15px ${feature.glow}`,
                `inset 0 0 0px ${feature.glow}`
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Ambient colored glow */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 0.6 : 0.2,
            background: isHovered 
              ? `radial-gradient(circle at 50% 0%, ${feature.glow} 0%, transparent 80%)`
              : `radial-gradient(circle at 50% 0%, ${feature.glow} 0%, transparent 60%)`
          }}
          transition={{ duration: 0.35 }}
        />

        {/* Very subtle animated gradient inside */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
            transform: "skewX(-20deg)"
          }}
        />

        {/* Mouse Reflection */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,1), transparent 40%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Floating particles */}
        <Particles color={feature.iconColor} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between p-8 pointer-events-none">
          <motion.div 
            className="h-12 w-12 rounded-full bg-[#111216]/90 flex items-center justify-center mb-8 border shadow-inner transition-all duration-350 ease-out backdrop-blur-md"
            animate={{
              scale: isHovered ? 1.1 : 1,
              borderColor: isHovered ? feature.borderGlow : "rgba(255,255,255,0.1)",
              boxShadow: isHovered 
                ? `0 0 20px ${feature.glow}, inset 0 2px 5px rgba(0,0,0,0.8)` 
                : `0 0 0px transparent, inset 0 2px 5px rgba(0,0,0,0.5)`
            }}
          >
            <feature.icon 
              className="h-5 w-5 transition-all duration-350" 
              style={{ 
                color: feature.iconColor,
                filter: isHovered ? `drop-shadow(0 0 12px ${feature.iconColor})` : `drop-shadow(0 0 4px ${feature.iconColor})` 
              }} 
            />
          </motion.div>
          <div>
            <h3 className="text-xl font-medium text-[#FAFAFA] mb-2">{feature.title}</h3>
            <p className="text-[#A1A1AA] font-light">
              {feature.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

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
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
