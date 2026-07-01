"use client";

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

const POSTS = [
  {
    id: 1,
    user: "David Miller",
    time: "2 hours ago",
    text: "Just finished the new design system. The contrast ratios are looking incredible. Can't wait to share the final polished version with everyone! ✨",
    likes: 124,
    comments: 24,
    isLiked: false,
    isBookmarked: false,
    showComment: false,
    color: "from-emerald-400 to-teal-500"
  },
  {
    id: 2,
    user: "Elena Rodriguez",
    time: "5 hours ago",
    text: "Motion design isn't about making things move. It's about explaining how the interface works through time.",
    likes: 892,
    comments: 156,
    isLiked: false,
    isBookmarked: false,
    showComment: false,
    color: "from-blue-400 to-indigo-500"
  }
];

export function FeedShowcase() {
  const [posts, setPosts] = useState(POSTS);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-500, 500], [4, -4]);
  const rotateY = useTransform(mouseX, [-500, 500], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto-scroll and interaction loop
  useEffect(() => {
     let timeout: NodeJS.Timeout;
     
     const runSequence = () => {
        // Reset
        setPosts(POSTS);
        setScrollProgress(0);

        // Like post 1
        timeout = setTimeout(() => {
           setPosts(prev => prev.map(p => p.id === 1 ? { ...p, isLiked: true, likes: p.likes + 1 } : p));
           
           // Show comment on post 1
           timeout = setTimeout(() => {
              setPosts(prev => prev.map(p => p.id === 1 ? { ...p, showComment: true, comments: p.comments + 1 } : p));
              
              // Scroll down to post 2
              timeout = setTimeout(() => {
                 setScrollProgress(-120); // scroll offset
                 
                 // Bookmark post 2
                 timeout = setTimeout(() => {
                    setPosts(prev => prev.map(p => p.id === 2 ? { ...p, isBookmarked: true } : p));
                    
                    // Restart loop
                    timeout = setTimeout(runSequence, 3000);
                 }, 1500);
              }, 2000);
           }, 1500);
        }, 1500);
     };

     runSequence();
     return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      className="relative w-full max-w-lg aspect-[4/5] flex items-center justify-center [perspective:1000px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full"
         animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Scroll Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 flex flex-col"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        {/* Top Navbar */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-white/5 relative z-20 bg-black/40 backdrop-blur-md">
           <div className="text-white font-medium text-lg tracking-wide">Feed</div>
           <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10" />
        </div>

        <div className="flex-1 overflow-hidden relative p-6 pt-2">
           <motion.div 
             className="flex flex-col gap-6"
             animate={{ y: scrollProgress }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           >
              {posts.map((post) => (
                 <div key={post.id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
                    {/* Post Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${post.color} p-[1px]`}>
                            <div className="w-full h-full bg-black/50 rounded-full" />
                         </div>
                         <div>
                            <div className="text-white font-medium text-sm">{post.user}</div>
                            <div className="text-white/40 text-xs">{post.time}</div>
                         </div>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-white/40" />
                    </div>

                    {/* Post Content */}
                    <div className="text-white/80 text-sm leading-relaxed">
                      {post.text}
                    </div>

                    {/* Post Image Placeholder (only for post 1) */}
                    {post.id === 1 && (
                       <div className="w-full h-32 rounded-2xl bg-gradient-to-tr from-white/5 to-white/10 border border-white/5 relative overflow-hidden group">
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: [0, 45, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <AnimatePresence>
                             {post.isLiked && (
                                <motion.div 
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1.5, opacity: 1 }}
                                  exit={{ scale: 2, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: "easeOut" }}
                                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                   <Heart className="w-16 h-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" fill="white" />
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-6 pt-2">
                       <motion.div className="flex gap-2 items-center text-white/50 cursor-pointer" animate={post.isLiked ? { color: "#ef4444" } : {}}>
                          <motion.div animate={post.isLiked ? { scale: [1, 1.4, 1] } : {}} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                             <Heart className="w-5 h-5" fill={post.isLiked ? "#ef4444" : "transparent"} color={post.isLiked ? "#ef4444" : "currentColor"} />
                          </motion.div>
                          <span className="text-sm font-medium">{post.likes}</span>
                       </motion.div>
                       
                       <div className="flex gap-2 items-center text-white/50 cursor-pointer">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                       </div>

                       <div className="flex gap-2 items-center text-white/50 cursor-pointer">
                          <Share2 className="w-5 h-5" />
                       </div>

                       <motion.div className="ml-auto text-white/50 cursor-pointer" animate={post.isBookmarked ? { color: "#3b82f6" } : {}}>
                          <motion.div animate={post.isBookmarked ? { scale: [1, 1.3, 1] } : {}} transition={{ type: "spring" }}>
                             <Bookmark className="w-5 h-5" fill={post.isBookmarked ? "#3b82f6" : "transparent"} color={post.isBookmarked ? "#3b82f6" : "currentColor"} />
                          </motion.div>
                       </motion.div>
                    </div>

                    {/* Comment Reveal */}
                    <AnimatePresence>
                       {post.showComment && (
                          <motion.div 
                             initial={{ opacity: 0, height: 0, marginTop: 0 }}
                             animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                             exit={{ opacity: 0, height: 0, marginTop: 0 }}
                             className="overflow-hidden border-t border-white/5 pt-3"
                          >
                             <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
                                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-white/70">
                                   <span className="font-medium text-white block mb-0.5">Jane Doe</span>
                                   Absolutely stunning work. The typography is perfect.
                                </div>
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              ))}
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
