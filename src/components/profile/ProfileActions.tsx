"use client";

import React, { useState } from "react";
import FollowButton from "@/components/FollowButton";
import StartChatButton from "@/components/StartChatButton";
import { Share2, Edit2, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ProfileActionsProps = {
  profileUserId: string;
  isCurrentUser: boolean;
  initialIsFollowing: boolean;
  onEditClick?: () => void;
};

export function ProfileActions({
  profileUserId,
  isCurrentUser,
  initialIsFollowing,
  onEditClick
}: ProfileActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Profile URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Share profile Button */}
      <button
        onClick={handleShare}
        className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-white/60 hover:text-white transition active:scale-95 flex items-center justify-center shrink-0"
        title="Share Profile"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
      </button>

      {isCurrentUser ? (
        <button
          onClick={onEditClick}
          className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 active:scale-95"
        >
          <Edit2 className="w-3.5 h-3.5 text-white/60" /> Edit Profile
        </button>
      ) : (
        <>
          <StartChatButton targetUserId={profileUserId} />
          <FollowButton targetUserId={profileUserId} initialIsFollowing={initialIsFollowing} />
        </>
      )}
    </div>
  );
}
