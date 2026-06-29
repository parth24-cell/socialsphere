"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
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
    <div>
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      </div>
      
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No users found.</div>
        ) : (
          filtered.map((u) => (
            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
              <Link href={`/${u.username}`} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt="Avatar" className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                    {u.displayName || u.username}
                  </p>
                  <p className="text-sm text-zinc-500">@{u.username}</p>
                  {u.isMutual && (
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
                      Follows you
                    </span>
                  )}
                </div>
              </Link>
              {currentUserId && currentUserId !== u.id && (
                <FollowButton targetUserId={u.id} initialIsFollowing={u.isFollowing} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
