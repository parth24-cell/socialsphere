"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DUMMY_POSTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="preview" className="relative py-32 z-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Experience the flow.
          </h2>
          <p className="text-zinc-400 text-lg">
            A meticulously crafted interface that puts your content front and center.
          </p>
        </motion.div>

        {/* Mockup Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden relative"
        >
          {/* Mockup Header */}
          <div className="h-16 border-b border-white/10 flex items-center px-6 gap-4 bg-white/5">
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
          <div className="p-6 md:p-10 h-[500px] relative flex flex-col justify-center">
            {DUMMY_POSTS.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: idx === activeIndex ? 1 : 0,
                  y: idx === activeIndex ? 0 : 20,
                  pointerEvents: idx === activeIndex ? "auto" : "none"
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-x-6 md:inset-x-10 top-1/2 -translate-y-1/2 bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    {post.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{post.author}</h4>
                    <p className="text-sm text-zinc-500">{post.handle} • {post.time}</p>
                  </div>
                </div>
                
                <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 text-zinc-500">
                  <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                    <Heart className="w-5 h-5" />
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
            ))}
          </div>

          {/* Ambient glow behind mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/20 blur-[100px] -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
