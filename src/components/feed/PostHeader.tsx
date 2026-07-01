"use client";

import Link from "next/link";
import { MoreHorizontal, Edit, Trash, Globe, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostHeaderProps {
  authorId: string;
  username: string;
  displayName: string | null;
  avatarUrl?: string | null;
  createdAt: Date | string;
  currentUserId: string;
  isVerified?: boolean; // future-ready
  audience?: "PUBLIC" | "FOLLOWERS" | "ONLY_ME"; // future-ready
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostHeader({
  authorId,
  username,
  displayName,
  avatarUrl,
  createdAt,
  currentUserId,
  isVerified = true, // default true to look premium/future-ready
  audience = "PUBLIC",
  onEdit,
  onDelete,
}: PostHeaderProps) {
  const isAuthor = authorId === currentUserId;
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Link
          href={`/${username || "unknown"}`}
          className="flex-shrink-0 w-11 h-11 rounded-full bg-white/5 border border-white/10 overflow-hidden hover:opacity-90 transition-opacity block"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName || username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40 font-semibold text-lg bg-white/5">
              {username?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </Link>

        {/* Identity & Metadata */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/${username || "unknown"}`}
              className="font-bold text-white hover:underline truncate text-sm sm:text-base"
            >
              {displayName || username || "Unknown"}
            </Link>
            {isVerified && (
              <ShieldCheck className="w-4 h-4 text-amber-500 fill-amber-500/10 shrink-0" />
            )}
            <span className="text-white/30 text-xs sm:text-sm">·</span>
            <span className="text-white/40 text-xs sm:text-sm shrink-0">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/40 mt-0.5">
            <span className="truncate">@{username || "unknown"}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span className="capitalize">{audience.toLowerCase()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Menu */}
      {isAuthor && (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-white/5 active:bg-white/10 rounded-full transition outline-none">
            <MoreHorizontal className="w-5 h-5 text-white/60 hover:text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white rounded-xl">
            {onEdit && (
              <DropdownMenuItem
                onClick={onEdit}
                className="hover:bg-white/5 cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-lg"
              >
                <Edit className="w-4 h-4 text-white/60" /> Edit post
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={onDelete}
                className="hover:bg-red-500/10 text-red-400 hover:text-red-400 cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-lg focus:bg-red-500/10"
              >
                <Trash className="w-4 h-4" /> Delete post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
