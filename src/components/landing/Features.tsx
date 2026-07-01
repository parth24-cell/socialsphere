"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { MessageSquare, Image as ImageIcon, Users, Shield, Sparkles, PenTool, Heart, MessageCircle, Bookmark, CheckCircle2, Lock, BarChart3, TrendingUp } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useSphere, ActiveFeature } from "./SphereContext";

// --- Micro UI Mockups ---

function MessagingMockup() {
  const [messages, setMessages] = useState<number[]>([0]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, prev.length]);
      setTimeout(() => setIsTyping(true), 2000);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 h-[400px] overflow-hidden relative">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
        <div>
          <div className="text-white font-medium text-sm">Sarah Jenkins</div>
          <div className="text-purple-400 text-xs">Online</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 justify-end">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`p-3 rounded-2xl max-w-[80%] text-sm ${m % 2 === 0 ? "bg-white/10 text-white self-start rounded-tl-sm" : "bg-purple-600 text-white self-end rounded-tr-sm"}`}
            >
              {m % 2 === 0 ? "Hey! Are we still on for the meeting?" : "Yes, I'll send the link soon."}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/5 p-3 rounded-2xl rounded-tl-sm self-start flex gap-1 items-center"
            >
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StoriesMockup() {
  return (
    <div className="w-full max-w-sm aspect-[9/16] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden flex flex-col">
      <div className="flex gap-1 mb-4 relative z-10">
        <motion.div className="h-1 bg-white/20 rounded-full flex-1 overflow-hidden">
           <motion.div className="h-full bg-white" animate={{ width: ["0%", "100%"] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
        </motion.div>
        <div className="h-1 bg-white/20 rounded-full flex-1" />
      </div>
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 p-0.5">
           <div className="w-full h-full bg-white/20 rounded-full" />
        </div>
        <div className="text-white text-sm font-medium">Alex Chen</div>
      </div>
      <motion.div 
         className="absolute inset-0 z-0 bg-gradient-to-b from-blue-600/40 to-transparent"
         animate={{ scale: [1, 1.05, 1] }}
         transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}

function FeedMockup() {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
     const t = setInterval(() => setLiked(l => !l), 3000);
     return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6 h-[450px] overflow-hidden">
      <motion.div 
         animate={{ y: [50, 0] }} 
         transition={{ duration: 1, ease: "easeOut" }}
         className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-4"
      >
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/50" />
            <div>
               <div className="text-white font-medium text-sm">David Miller</div>
               <div className="text-white/40 text-xs">2 hours ago</div>
            </div>
         </div>
         <div className="h-24 bg-white/5 rounded-lg w-full" />
         <div className="flex gap-4">
            <motion.div className="flex gap-2 items-center text-white/50" animate={liked ? { color: "#ef4444" } : {}}>
               <motion.div animate={liked ? { scale: [1, 1.5, 1] } : {}}>
                  <Heart className="w-5 h-5" fill={liked ? "#ef4444" : "transparent"} color={liked ? "#ef4444" : "currentColor"} />
               </motion.div>
               <span className="text-sm">{liked ? 125 : 124}</span>
            </motion.div>
            <div className="flex gap-2 items-center text-white/50">
               <MessageCircle className="w-5 h-5" />
               <span className="text-sm">24</span>
            </div>
            <div className="ml-auto text-white/50">
               <Bookmark className="w-5 h-5" />
            </div>
         </div>
      </motion.div>
    </div>
  );
}

function CommunitiesMockup() {
  return (
    <div className="w-full max-w-md aspect-square bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden flex items-center justify-center">
       <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30">
          <motion.circle cx="50" cy="50" r="30" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="4 4" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
       </svg>
       {[...Array(5)].map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const x = Math.cos(angle) * 80;
          const y = Math.sin(angle) * 80;
          return (
             <motion.div 
               key={i}
               className="absolute w-10 h-10 rounded-full border-2 border-cyan-500 bg-black overflow-hidden flex items-center justify-center"
               animate={{ x, y }}
               transition={{ duration: 2, ease: "easeOut", delay: i * 0.1 }}
             >
                <div className="w-full h-full bg-cyan-500/20" />
             </motion.div>
          )
       })}
       <motion.div 
         className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
         animate={{ scale: [1, 1.1, 1] }}
         transition={{ duration: 3, repeat: Infinity }}
       >
          <Users className="w-8 h-8 text-white" />
       </motion.div>
    </div>
  );
}

function AuthMockup() {
  const [step, setStep] = useState(0);
  useEffect(() => {
     const t = setInterval(() => {
        setStep(s => (s + 1) % 3);
     }, 2000);
     return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-sm bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center gap-6 h-[400px]">
       <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-indigo-400" />
       </div>
       <div className="text-white font-medium text-lg">Secure Login</div>
       
       <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10 flex items-center px-4 text-white/50 text-sm overflow-hidden relative">
          admin@socialsphere.com
          {step === 0 && <motion.div className="absolute inset-0 bg-indigo-500/20" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity }} />}
       </div>

       {step >= 1 && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 w-full justify-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
               <div key={i} className="w-10 h-12 rounded-lg bg-white/10 border border-indigo-500/50 flex items-center justify-center text-white font-mono">
                  •
               </div>
            ))}
         </motion.div>
       )}

       {step === 2 && (
         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Verified</span>
         </motion.div>
       )}
    </div>
  );
}

function CreatorMockup() {
  return (
    <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6">
       <div className="flex justify-between items-center">
          <div className="text-white font-medium">Dashboard</div>
          <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center gap-1">
             <TrendingUp className="w-3 h-3" /> +24%
          </div>
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-1">
             <div className="text-white/40 text-xs">Followers</div>
             <div className="text-white text-2xl font-semibold">12,402</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-1">
             <div className="text-white/40 text-xs">Engagement</div>
             <div className="text-white text-2xl font-semibold">4.8%</div>
          </div>
       </div>
       <div className="h-40 bg-white/5 border border-white/5 rounded-xl p-4 flex items-end justify-between gap-2 overflow-hidden relative">
          {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
             <motion.div 
               key={i} 
               className="w-full bg-amber-500/80 rounded-t-sm"
               initial={{ height: 0 }}
               whileInView={{ height: `${h}%` }}
               transition={{ duration: 1, delay: i * 0.1 }}
               viewport={{ once: true }}
             />
          ))}
       </div>
    </div>
  );
}


// --- Sections ---

function ShowcaseSection({
  featureId,
  title,
  description,
  mockup,
  align = "left"
}: {
  featureId: ActiveFeature;
  title: string;
  description: string;
  mockup: React.ReactNode;
  align?: "left" | "right";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-40% 0px -40% 0px" });
  const { setActiveFeature, activeFeature } = useSphere();

  useEffect(() => {
    if (isInView) {
      setActiveFeature(featureId);
    }
  }, [isInView, featureId, setActiveFeature]);

  return (
    <div ref={containerRef} className="min-h-[100vh] w-full flex items-center py-20 relative z-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
         
         {align === "left" && (
           <div className="flex-1 w-full flex justify-center md:justify-start">
             {mockup}
           </div>
         )}

         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           viewport={{ margin: "-20%" }}
           className={`flex-1 flex flex-col ${align === "left" ? "md:items-start" : "md:items-end text-right"}`}
         >
           <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-6 drop-shadow-lg">
             {title}
           </h2>
           <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-lg">
             {description}
           </p>
         </motion.div>

         {align === "right" && (
           <div className="flex-1 w-full flex justify-center md:justify-end">
             {mockup}
           </div>
         )}
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative z-10 flex flex-col w-full">
      <ShowcaseSection 
         featureId="messaging"
         title="Real-Time Messaging"
         description="Experience instant, ultra-low latency connections. No waiting, no refreshing. Just fluid, uninterrupted conversations."
         mockup={<MessagingMockup />}
         align="left"
      />
      <ShowcaseSection 
         featureId="stories"
         title="Stories"
         description="Share fleeting moments with high fidelity. Immerse yourself in full-screen experiences that feel native and fast."
         mockup={<StoriesMockup />}
         align="right"
      />
      <ShowcaseSection 
         featureId="feed"
         title="The Feed, Perfected"
         description="A beautifully animated social feed designed for engagement. Smooth scrolling, instant likes, and a layout that breathes."
         mockup={<FeedMockup />}
         align="left"
      />
      <ShowcaseSection 
         featureId="communities"
         title="Communities"
         description="Find your tribe. Watch your network expand as you connect with specialized groups in a dynamically growing ecosystem."
         mockup={<CommunitiesMockup />}
         align="right"
      />
      <ShowcaseSection 
         featureId="auth"
         title="Secure Authentication"
         description="Enterprise-grade security protecting your data. Seamless login flows with biometric and OTP support built-in."
         mockup={<AuthMockup />}
         align="left"
      />
      <ShowcaseSection 
         featureId="creator"
         title="Creator Tools"
         description="Everything you need to build your audience. Deep analytics, growth tracking, and powerful insights at a glance."
         mockup={<CreatorMockup />}
         align="right"
      />
    </section>
  );
}
