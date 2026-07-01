"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CornerDownRight } from "lucide-react";
import { addComment } from "@/actions/post";

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  author: {
    id: string;
    profile?: {
      username: string;
      displayName: string | null;
      avatarUrl?: string | null;
    } | null;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId: string;
  onCommentAdded?: () => void;
}

export function CommentSection({
  postId,
  comments,
  currentUserId,
  onCommentAdded,
}: CommentSectionProps) {
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      await addComment(postId, commentContent);
      setCommentContent("");
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 mt-4 pt-4 border-t border-white/5 animate-in fade-in duration-300">
      {/* Inline composer for replies */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
          <div className="w-full h-full flex items-center justify-center text-white/40 font-semibold text-xs">
            💬
          </div>
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Write your reply..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={submitting}
            className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm outline-none text-white transition-all placeholder:text-white/30 pr-16"
          />
          <button
            type="submit"
            disabled={!commentContent.trim() || submitting}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500 hover:text-amber-400 disabled:text-white/20 transition-colors px-2 py-1"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reply"}
          </button>
        </div>
      </form>

      {/* Thread list */}
      {comments && comments.length > 0 && (
        <div className="space-y-4 pt-2 relative">
          {/* Thread Line */}
          <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-white/5" />

          {comments.map((comment) => {
            const author = comment.author;
            const profile = author?.profile;
            const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <div key={comment.id} className="flex gap-3 relative group pl-2">
                <div className="flex flex-col items-center">
                  <Link
                    href={`/${profile?.username || "unknown"}`}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden hover:opacity-90 transition-opacity block relative z-10 shrink-0"
                  >
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName || profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40 font-semibold text-xs">
                        {profile?.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </Link>
                </div>

                <div className="flex-1 min-w-0 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Link
                      href={`/${profile?.username || "unknown"}`}
                      className="font-bold text-white hover:underline text-sm truncate"
                    >
                      {profile?.displayName || profile?.username || "Unknown"}
                    </Link>
                    <span className="text-white/30 text-xs truncate">
                      @{profile?.username || "unknown"}
                    </span>
                    <span className="text-white/30 text-xs">·</span>
                    <span className="text-white/40 text-xs shrink-0">
                      {formattedDate}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
