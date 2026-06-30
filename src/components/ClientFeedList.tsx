"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";
import { getFeedPosts } from "@/actions/feed";

export default function ClientFeedList({ 
  initialPosts, 
  currentUserId 
}: { 
  initialPosts: any[], 
  currentUserId: string 
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
      <div className="text-center p-8 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm flex flex-col items-center justify-center gap-4">
        <p>Your feed is empty. Follow people to start seeing posts.</p>
        <a href="/explore" className="px-4 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition">
          Find people to follow
        </a>
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
