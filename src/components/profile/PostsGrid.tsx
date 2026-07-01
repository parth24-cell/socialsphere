"use client";

import React, { useState } from "react";
import PostCard from "@/components/PostCard";
import { LayoutGrid, List, MessageSquare } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Image as ImageIcon } from "lucide-react";

type PostsGridProps = {
  posts: any[];
  currentUserId: string;
};

export function PostsGrid({ posts, currentUserId }: PostsGridProps) {
  const [viewMode, setViewMode] = useState<"LIST" | "GRID">("LIST");

  if (posts.length === 0) {
    return (
      <div className="py-8 px-6">
        <EmptyState
          title="No posts yet"
          description="This profile has not shared any stories or posts yet. Check back later!"
          icon={<MessageSquare className="w-8 h-8" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle Bar */}
      <div className="flex justify-between items-center px-6 py-2 select-none border-b border-white/5 bg-white/[0.002]">
        <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold">
          Showing {posts.length} {posts.length === 1 ? "Post" : "Posts"}
        </span>
        <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-xl">
          <button
            onClick={() => setViewMode("LIST")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "LIST" ? "bg-white/10 text-amber-500" : "text-white/40 hover:text-white"}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("GRID")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "GRID" ? "bg-white/10 text-amber-500" : "text-white/40 hover:text-white"}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or List rendering */}
      {viewMode === "LIST" ? (
        <div className="divide-y divide-white/5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 px-6 pb-8">
          {posts.map((post) => {
            const hasImages = post.images && post.images.length > 0;
            return (
              <div 
                key={post.id}
                onClick={() => {
                  // Scroll to list view target post, or temporarily switch view mode
                  setViewMode("LIST");
                  setTimeout(() => {
                    document.getElementById(`msg-${post.id}`)?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="aspect-square bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden cursor-pointer group relative hover:border-amber-500/20 transition-all duration-300"
              >
                {hasImages ? (
                  <>
                    <img 
                      src={post.images[0].url} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute top-2.5 right-2.5 p-1 bg-black/60 rounded-lg text-white/80">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full p-4 flex flex-col justify-between items-start text-left bg-gradient-to-br from-white/[0.02] to-transparent">
                    <p className="text-xs text-white/60 line-clamp-4 leading-relaxed font-medium">
                      {post.content}
                    </p>
                    <span className="text-[9px] uppercase tracking-wider text-white/30">Text Post</span>
                  </div>
                )}
                {/* Hover overlay with engagement summary */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
                  <span className="flex items-center gap-1 text-white font-bold text-xs">
                    ❤️ {post._count?.likes || 0}
                  </span>
                  <span className="flex items-center gap-1 text-white font-bold text-xs">
                    💬 {post._count?.comments || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
