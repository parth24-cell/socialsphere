"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import FollowButton from "@/components/FollowButton";

type UserItem = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isFollowing: boolean; // Does current user follow them
  isMutual: boolean;    // Do they also follow current user
};

export default function UserList({ 
  users, 
  currentUserId 
}: { 
  users: UserItem[], 
  currentUserId?: string 
}) {
  const [query, setQuery] = useState("");

  const filtered = users.filter(u => 
    u.username.toLowerCase().includes(query.toLowerCase()) || 
    (u.displayName && u.displayName.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="p-4 border-b border-white/5 select-none bg-white/[0.002]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-white/40" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-3 pl-11 pr-4 text-xs text-white outline-none transition-all placeholder:text-white/30"
          />
        </div>
      </div>
      
      {/* Users List */}
      <div className="divide-y divide-white/5 px-6">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/30 text-xs">No users found.</div>
        ) : (
          filtered.map((u) => (
            <div 
              key={u.id} 
              className="py-4 flex items-center justify-between hover:bg-white/[0.01] border-b border-transparent hover:border-white/5 transition-all duration-300 rounded-2xl px-3"
            >
              <Link href={`/${u.username}`} className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white/40 text-sm">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt="Avatar" className="w-full h-full object-cover object-center" />
                  ) : (
                    u.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="font-bold text-white leading-tight truncate hover:underline text-sm sm:text-base">
                    {u.displayName || u.username}
                  </p>
                  <p className="text-[11px] text-white/40 font-mono mt-0.5">@{u.username}</p>
                  {u.isMutual && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-amber-500 font-bold mt-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg w-max">
                      <Sparkles className="w-2.5 h-2.5" /> Follows you
                    </span>
                  )}
                </div>
              </Link>
              {currentUserId && currentUserId !== u.id && (
                <div className="shrink-0 pl-4 select-none">
                  <FollowButton targetUserId={u.id} initialIsFollowing={u.isFollowing} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
