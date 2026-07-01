"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Compass, Users } from "lucide-react";

type DiscoverConnectionsProps = {
  suggestedCreators: any[];
};

export function DiscoverConnections({ suggestedCreators }: DiscoverConnectionsProps) {
  const topCreators = suggestedCreators.slice(0, 2);

  return (
    <div className="px-6 select-none">
      <div className="bg-gradient-to-br from-amber-500/10 via-white/[0.01] to-transparent border border-white/10 rounded-[2rem] p-6 relative overflow-hidden group">
        
        {/* Glow ambient accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          <h3 className="text-base font-bold text-white font-heading">Discover Your Next Connection</h3>
        </div>

        <p className="text-xs text-white/50 leading-relaxed mb-6 max-w-md">
          Alined with your interests. Join discussions, meet creative minds, and become part of growing communities.
        </p>

        {/* Curation items */}
        <div className="space-y-4">
          
          {/* Creator link */}
          {topCreators.map((creator) => (
            <div 
              key={creator.id}
              className="p-4 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 flex items-center justify-between"
            >
              <Link href={`/${creator.profile?.username}`} className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center font-bold text-white/40 text-xs shrink-0">
                  {creator.profile?.avatarUrl ? (
                    <img src={creator.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    creator.profile?.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-white truncate leading-tight hover:underline">
                    {creator.profile?.displayName || creator.profile?.username}
                  </p>
                  <p className="text-[10px] text-white/40 mt-0.5 truncate">Recommended Creator</p>
                </div>
              </Link>
              <Link 
                href={`/${creator.profile?.username}`}
                className="p-2 hover:bg-white/5 border border-white/10 rounded-xl transition text-amber-500 hover:text-amber-400"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ))}

          {/* Group simulated link */}
          <div className="p-4 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-white truncate leading-tight">AI & Design Frontiers</p>
                <p className="text-[10px] text-white/40 mt-0.5">Trending Simulated Community</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white">
              View
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
