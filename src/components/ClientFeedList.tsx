"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";
import { getFeedPosts } from "@/actions/feed";

import Link from "next/link";
import FollowButton from "./FollowButton";

export default function ClientFeedList({ 
  initialPosts, 
  currentUserId,
  suggestedUsers = []
}: { 
  initialPosts: any[], 
  currentUserId: string,
  suggestedUsers?: any[]
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length === 20);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(initialPosts.length === 20);
  }, [initialPosts]);

  const loadMorePosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const newPosts = await getFeedPosts(nextPage);
      
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
  }, [page]);

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
      <div className="space-y-6 max-w-2xl mx-auto py-8">
        <div className="text-center p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">👋 Welcome to SocialSphere!</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Follow people to start seeing posts.</p>
        </div>

        {suggestedUsers.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Suggested for you</h3>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {suggestedUsers.map(user => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                  <Link href={`/${user.profile?.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                      {user.profile?.avatarUrl ? (
                        <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover object-center" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500 text-lg">
                          {user.profile?.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-zinc-900 dark:text-zinc-50 truncate">{user.profile?.displayName || user.profile?.username}</p>
                      <p className="text-sm text-zinc-500 truncate">@{user.profile?.username}</p>
                      {user._count?.followers > 0 && (
                        <p className="text-xs text-zinc-400 mt-0.5">{user._count.followers} {user._count.followers === 1 ? 'follower' : 'followers'}</p>
                      )}
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
    <div className="space-y-4">
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
        <div className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="py-8 text-center text-sm text-zinc-500">
          You've caught up!
        </div>
      )}
    </div>
  );
}
