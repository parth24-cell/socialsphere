"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface EngagementBarProps {
  postId: string;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onCommentToggle: () => void;
}

export function EngagementBar({
  postId,
  isLiked,
  likesCount,
  commentsCount,
  isBookmarked,
  onLike,
  onBookmark,
  onCommentToggle,
}: EngagementBarProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const url = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    } finally {
      setTimeout(() => setSharing(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4 py-2 border-t border-b border-white/5 text-white/60">
      {/* Comment Trigger */}
      <button
        onClick={onCommentToggle}
        className="flex items-center gap-2 hover:text-white transition-colors group relative"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl group-hover:bg-white/5 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.div>
        <span className="text-xs font-semibold">{commentsCount}</span>
      </button>

      {/* Like Trigger */}
      <button
        onClick={onLike}
        className={`flex items-center gap-2 transition-colors group relative ${
          isLiked ? "text-pink-500" : "hover:text-pink-500"
        }`}
      >
        <motion.div
          animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl group-hover:bg-pink-500/10 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-pink-500" : ""}`} />
        </motion.div>
        <span className="text-xs font-semibold">{likesCount}</span>
      </button>

      {/* Bookmark Trigger */}
      <button
        onClick={onBookmark}
        className={`flex items-center gap-2 transition-colors group relative ${
          isBookmarked ? "text-amber-500" : "hover:text-amber-500"
        }`}
      >
        <motion.div
          animate={{ y: isBookmarked ? [0, -3, 0] : 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl group-hover:bg-amber-500/10 transition-colors"
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-amber-500" : ""}`} />
        </motion.div>
      </button>

      {/* Share Trigger */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 hover:text-white transition-colors group relative"
      >
        <motion.div
          animate={{ rotate: sharing ? [0, 15, -15, 0] : 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl group-hover:bg-white/5 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </motion.div>
      </button>
    </div>
  );
}
