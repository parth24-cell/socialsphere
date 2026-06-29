"use client";

import { useState, useEffect } from "react";
import { toggleFollow } from "@/actions/follow";

type FollowButtonProps = {
  targetUserId: string;
  initialIsFollowing: boolean;
};

export default function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  // Synchronize state if the server passes a new value (e.g. after revalidation)
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollow = async () => {
    setLoading(true);
    const previousState = isFollowing;
    
    // Optimistic update
    setIsFollowing(!isFollowing);
    
    try {
      const result = await toggleFollow(targetUserId);
      if (result) {
        setIsFollowing(result.followed);
      }
    } catch (err) {
      // Revert if failed
      setIsFollowing(previousState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
        isFollowing
          ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-500 border border-zinc-200 dark:border-zinc-700"
          : "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
