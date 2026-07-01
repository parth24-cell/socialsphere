import React from "react";
import Link from "next/link";

type ProfileStatsProps = {
  username: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
};

export function ProfileStats({
  username,
  postsCount,
  followersCount,
  followingCount
}: ProfileStatsProps) {
  return (
    <div className="flex gap-8 py-3 text-sm select-none border-t border-b border-white/5 bg-white/[0.005] px-6 rounded-2xl">
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-white tracking-tight">{postsCount}</span>
        <span className="text-white/40 text-xs uppercase tracking-wider">Posts</span>
      </div>
      
      <Link href={`/${username}/followers`} className="flex items-center gap-1.5 hover:text-white transition group">
        <span className="font-bold text-white tracking-tight group-hover:text-amber-500 transition-colors">{followersCount}</span>
        <span className="text-white/40 text-xs uppercase tracking-wider group-hover:text-white/60 transition-colors">Followers</span>
      </Link>
      
      <Link href={`/${username}/following`} className="flex items-center gap-1.5 hover:text-white transition group">
        <span className="font-bold text-white tracking-tight group-hover:text-amber-500 transition-colors">{followingCount}</span>
        <span className="text-white/40 text-xs uppercase tracking-wider group-hover:text-white/60 transition-colors">Following</span>
      </Link>
    </div>
  );
}
