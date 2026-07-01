"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Users } from "lucide-react";
import FollowButton from "@/components/FollowButton";

type CreatorItem = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followersCount?: number;
};

type CreatorCarouselProps = {
  creators: CreatorItem[];
};

export function CreatorCarousel({ creators }: CreatorCarouselProps) {
  if (creators.length === 0) return null;

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center gap-1.5 text-white/40 px-6">
        <Users className="w-3.5 h-3.5 text-amber-500" />
        <h4 className="text-[10px] uppercase tracking-wider font-bold">Suggested Creators</h4>
      </div>
      
      {/* Scrollable list wrapper */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-none snap-x snap-mandatory">
        {creators.map((c) => (
          <div
            key={c.id}
            className="min-w-[200px] max-w-[200px] p-5 bg-white/[0.01] border border-white/5 rounded-3xl flex flex-col justify-between items-center text-center snap-align-start hover:border-white/10 hover:bg-white/[0.015] transition-all duration-300 group relative"
          >
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-amber-500/[0.02] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <Link href={`/${c.username}`} className="flex flex-col items-center flex-1 min-w-0 w-full mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center font-bold text-white/40 text-lg mb-3 shrink-0">
                {c.avatarUrl ? (
                  <img src={c.avatarUrl} alt={c.username} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  c.username.charAt(0).toUpperCase()
                )}
              </div>
              <p className="font-bold text-white truncate max-w-full text-xs sm:text-sm leading-tight hover:underline">
                {c.displayName || c.username}
              </p>
              <p className="text-[9px] text-white/40 font-mono mt-0.5 truncate max-w-full">@{c.username}</p>
              
              {c.bio && (
                <p className="text-[10px] text-white/40 mt-2.5 line-clamp-2 leading-relaxed">
                  {c.bio}
                </p>
              )}
            </Link>

            <div className="w-full select-none shrink-0">
              <FollowButton targetUserId={c.id} initialIsFollowing={false} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
