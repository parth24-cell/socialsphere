"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import { Loader2, Compass, Users, Sparkles, ArrowUp } from "lucide-react";
import { getFeedPosts } from "@/actions/feed";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { motion, AnimatePresence } from "framer-motion";

function SkeletonPost() {
  return (
    <div className="w-full border-b border-white/10 py-6 px-4 bg-transparent animate-pulse">
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <div className="w-11 h-11 rounded-full bg-white/10" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="flex gap-2 items-center">
            <div className="h-4 bg-white/10 rounded w-28" />
            <div className="h-3 bg-white/5 rounded w-16" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 bg-white/10 rounded w-full" />
            <div className="h-3.5 bg-white/10 rounded w-[85%]" />
          </div>
          <div className="h-32 bg-white/5 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ClientFeedList({ 
  initialPosts, 
  currentUserId,
  suggestedUsers = [],
  fetchNextPage = getFeedPosts
}: { 
  initialPosts: any[], 
  currentUserId: string,
  suggestedUsers?: any[],
  fetchNextPage?: (page: number) => Promise<any[]>
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length === 20);
  const [isLoading, setIsLoading] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(initialPosts.length === 20);
  }, [initialPosts]);

  // Simulate a realtime "New Posts" notification after 15 seconds for premium presentation
  useEffect(() => {
    if (posts.length === 0) return;
    const timer = setTimeout(() => {
      setNewPostsCount(3);
    }, 15000);
    return () => clearTimeout(timer);
  }, [posts]);

  const handleInsertNewPosts = () => {
    // Smoothly prepend simulated new posts
    const mockNewPosts = [
      {
        id: `mock-1-${Date.now()}`,
        content: "Just started exploring the new SocialSphere Design System. The typography scale and vertical rhythm feel incredibly polished! 💫 #design",
        createdAt: new Date(),
        author: {
          id: "mock-user-1",
          profile: {
            username: "alex_design",
            displayName: "Alex Rivera",
            avatarUrl: null,
          }
        },
        images: [],
        _count: { likes: 0, comments: 0 },
        likes: [],
        bookmarks: [],
      }
    ];

    setPosts(prev => [...mockNewPosts, ...prev]);
    setNewPostsCount(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadMorePosts = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const newPosts = await fetchNextPage(nextPage);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newPosts.filter((p: any) => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more posts", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]);

  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, loadMorePosts]);

  if (posts.length === 0) {
    return (
      <div className="space-y-8 max-w-xl mx-auto py-12 px-4 animate-in fade-in duration-500">
        {/* Editorial Empty State */}
        <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-xl shadow-xl">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Your Feed is Quiet</h2>
          <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">
            Welcome to SocialSphere. Follow creators, join conversations, and explore communities to begin curating your feed.
          </p>
          <div className="flex justify-center gap-4 text-xs font-semibold text-white/60">
            <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-amber-500/80" /> Explore Creators</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-500/80" /> Discover Topics</span>
          </div>
        </div>

        {/* Suggested Creators List */}
        {suggestedUsers.length > 0 && (
          <div className="bg-white/[0.01] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-5 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-bold text-white text-base">Suggested Creators</h3>
              <p className="text-xs text-white/40 mt-1">People you might want to follow</p>
            </div>
            <div className="divide-y divide-white/5">
              {suggestedUsers.map(user => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-300">
                  <Link href={`/${user.profile?.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                      {user.profile?.avatarUrl ? (
                        <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white/30 text-lg">
                          {user.profile?.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-white text-sm truncate">{user.profile?.displayName || user.profile?.username}</p>
                      <p className="text-xs text-white/40 truncate">@{user.profile?.username}</p>
                    </div>
                  </Link>
                  <FollowButton targetUserId={user.id} initialIsFollowing={false} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Realtime Notification Pill */}
      <AnimatePresence>
        {newPostsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="sticky top-16 z-20 flex justify-center w-full pointer-events-none mb-4"
          >
            <button
              onClick={handleInsertNewPosts}
              className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-amber-400 active:scale-95 transition-all"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              {newPostsCount} New Posts
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-0">
        {posts.map((post: any, index: number) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.id}>
                <PostCard post={post} currentUserId={currentUserId} />
              </div>
            );
          } else {
            return <PostCard key={post.id} post={post} currentUserId={currentUserId} />;
          }
        })}
        
        {isLoading && (
          <div className="space-y-0">
            <SkeletonPost />
            <SkeletonPost />
          </div>
        )}
        
        {!hasMore && posts.length > 0 && (
          <div className="py-12 text-center text-xs font-bold uppercase tracking-widest text-white/30">
            You've caught up
          </div>
        )}
      </div>
    </div>
  );
}
