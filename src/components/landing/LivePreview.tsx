"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useRef } from "react";

const DUMMY_POSTS = [
  {
    id: 1,
    author: "Elena Rodriguez",
    handle: "@elena_design",
    avatar: "ER",
    content: "Just finalized the new design system for our enterprise client. The sheer power of CSS variables mixed with Tailwind is unmatched. 🎨✨",
    likes: 124,
    comments: 18,
    time: "2h ago"
  },
  {
    id: 2,
    author: "Marcus Chen",
    handle: "@marcus_dev",
    avatar: "MC",
    content: "Deploying to production on a Friday because we trust our CI/CD pipeline. Wish me luck! 🚀",
    likes: 342,
    comments: 45,
    time: "4h ago"
  },
  {
    id: 3,
    author: "Sarah Jenkins",
    handle: "@sarah_j",
    avatar: "SJ",
    content: "The new Next.js app router is a game changer for streaming server rendering. Our Lighthouse scores just hit 100 across the board.",
    likes: 89,
    comments: 12,
    time: "6h ago"
  }
];

export function LivePreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll over this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} id="preview" className="relative h-[300vh] z-20">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center mb-12 max-w-2xl px-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            Experience the flow.
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-light">
            Scroll to interact. A meticulously crafted interface that puts your content front and center.
          </p>
        </motion.div>

        {/* Mockup Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden relative mx-6"
        >
          {/* Mockup Header */}
          <div className="h-16 border-b border-white/5 flex items-center px-6 gap-4 bg-white/[0.02]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 text-center text-sm font-medium text-zinc-500">
              socialsphere.com/feed
            </div>
            <div className="w-10" />
          </div>

          {/* Mockup Body */}
          <div className="p-6 md:p-10 h-[500px] relative flex flex-col justify-center overflow-hidden">
            {DUMMY_POSTS.map((post, idx) => {
              // Calculate specific scroll ranges for each post to fade in and out
              // Post 1: 0 to 0.33
              // Post 2: 0.33 to 0.66
              // Post 3: 0.66 to 1
              const startFadeIn = idx * 0.33;
              const peak = startFadeIn + 0.15;
              const startFadeOut = peak + 0.15;
              const end = startFadeOut + 0.15;

              const opacity = useTransform(
                smoothProgress, 
                [startFadeIn, peak, startFadeOut, end], 
                [0, 1, 1, 0]
              );
              
              const y = useTransform(
                smoothProgress, 
                [startFadeIn, peak, startFadeOut, end], 
                [50, 0, 0, -50]
              );

              const scale = useTransform(
                smoothProgress, 
                [startFadeIn, peak, startFadeOut, end], 
                [0.9, 1, 1, 0.9]
              );
              
              const blur = useTransform(
                smoothProgress, 
                [startFadeIn, peak, startFadeOut, end], 
                ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
              );

              return (
                <motion.div
                  key={post.id}
                  style={{ opacity, y, scale, filter: blur }}
                  className="absolute inset-x-6 md:inset-x-10 top-1/2 -translate-y-1/2 bg-zinc-900/50 border border-white/5 rounded-2xl p-8 backdrop-blur-md"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{post.author}</h4>
                      <p className="text-sm text-zinc-500">{post.handle} • {post.time}</p>
                    </div>
                  </div>
                  
                  <p className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-8 font-light">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-8 text-zinc-500">
                    <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group">
                      <Heart className="w-5 h-5 group-hover:fill-current group-hover:text-red-500 transition-all" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div className="ml-auto hover:text-white transition-colors cursor-pointer">
                      <Bookmark className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Ambient glow behind mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 blur-[120px] -z-10 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
