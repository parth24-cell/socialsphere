import React from "react";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

type AvatarSectionProps = {
  avatarUrl: string | null;
  username: string;
  isOnline?: boolean;
  hasStory?: boolean;
  isVerified?: boolean;
  onAvatarClick?: () => void;
};

export function AvatarSection({
  avatarUrl,
  username,
  isOnline = false,
  hasStory = false,
  isVerified = false,
  onAvatarClick
}: AvatarSectionProps) {
  return (
    <div className="relative group select-none shrink-0 z-10 -mt-20 ml-6">
      {/* Glow highlight on hover */}
      <div className="absolute inset-0 bg-amber-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Ring container */}
      <div 
        onClick={onAvatarClick}
        className={cn(
          "w-36 h-36 rounded-[2.5rem] bg-zinc-950 p-[3px] border border-white/10 shadow-2xl relative transition-all duration-300",
          onAvatarClick && "cursor-pointer active:scale-95",
          hasStory && "bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-600 p-[3.5px]"
        )}
      >
        <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-zinc-900 border border-black/40 flex items-center justify-center font-bold text-4xl text-white/50 relative">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={username} 
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            username.charAt(0).toUpperCase()
          )}
        </div>

        {/* Live / Online status indicator */}
        {isOnline && (
          <span className="absolute bottom-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-zinc-950"></span>
          </span>
        )}

        {/* Verified icon on avatar ring */}
        {isVerified && (
          <div className="absolute -top-1 -right-1 bg-amber-500 border border-zinc-950 text-black p-1 rounded-full shadow-lg" title="Verified Creator">
            <Award className="w-3.5 h-3.5 font-bold" />
          </div>
        )}
      </div>
    </div>
  );
}
