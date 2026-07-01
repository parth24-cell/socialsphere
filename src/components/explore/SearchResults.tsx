"use client";

import React from "react";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";
import { Users, FileText, Search } from "lucide-react";
import { EmptyState } from "./EmptyState";

type SearchResultsProps = {
  query: string;
  activeFilter: "posts" | "users" | "all";
  posts: any[];
  users: any[];
  currentUserId: string;
  onClearQuery?: () => void;
};

export function SearchResults({
  query,
  activeFilter,
  posts,
  users,
  currentUserId,
  onClearQuery
}: SearchResultsProps) {
  const hasPosts = posts.length > 0;
  const hasUsers = users.length > 0;

  if (!hasPosts && !hasUsers) {
    return (
      <div className="px-6 py-8">
        <EmptyState
          title="No results found"
          description={`We couldn't find any creators or posts matching "${query}".`}
          icon={<Search className="w-8 h-8" />}
          suggestedQueries={["ArtificialIntelligence", "Photography", "DesignSystems"]}
          onQueryClick={(q) => {
            if (onClearQuery) {
              window.location.href = `/search?q=${encodeURIComponent(q)}`;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 select-none">
      
      {/* Creators Results */}
      {(activeFilter === "all" || activeFilter === "users") && hasUsers && (
        <div className="space-y-3 px-6">
          <div className="flex items-center gap-1.5 text-white/30 mb-2">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <h4 className="text-[10px] uppercase tracking-wider font-bold">Creators</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isFollowing = user.followers?.length > 0;
              return (
                <div 
                  key={user.id}
                  className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 flex items-center justify-between"
                >
                  <Link href={`/${user.profile?.username}`} className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/40 text-xs shrink-0">
                      {user.profile?.avatarUrl ? (
                        <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover object-center" />
                      ) : (
                        user.profile?.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-white truncate hover:underline leading-tight">
                        {user.profile?.displayName || user.profile?.username}
                      </p>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5 truncate">@{user.profile?.username}</p>
                    </div>
                  </Link>
                  {!isCurrentUser && (
                    <div className="shrink-0 pl-4 select-none">
                      <FollowButton targetUserId={user.id} initialIsFollowing={isFollowing} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts Results */}
      {(activeFilter === "all" || activeFilter === "posts") && hasPosts && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-white/30 px-6">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <h4 className="text-[10px] uppercase tracking-wider font-bold">Conversations & Posts</h4>
          </div>
          <div className="divide-y divide-white/5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
