import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

interface PostContainerProps {
  authorName: string;
  authorHandle: string;
  avatarSrc?: string;
  avatarFallback?: string;
  timestamp: string;
  content: React.ReactNode;
  mediaUrl?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
}

export function PostContainer({
  authorName,
  authorHandle,
  avatarSrc,
  avatarFallback = "U",
  timestamp,
  content,
  mediaUrl,
  likes = 0,
  comments = 0,
  shares = 0,
  isLiked = false,
}: PostContainerProps) {
  return (
    <div className="w-full border-b border-white/10 py-6 px-4 bg-transparent flex gap-4 transition-colors hover:bg-white/[0.02]">
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback className="bg-white/5 text-white">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white truncate">
              {authorName}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              @{authorHandle}
            </span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{timestamp}</span>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-white shrink-0"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="text-sm text-slate-200 mb-3 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>

        {/* Media (Optional) */}
        {mediaUrl && (
          <div className="rounded-2xl border border-white/10 overflow-hidden mb-3 bg-black/40">
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-6 mt-4">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
              <Heart
                className={cn(
                  "w-4 h-4",
                  isLiked ? "fill-primary text-primary" : ""
                )}
              />
            </div>
            <span className="text-xs font-medium">{likes}</span>
          </button>

          <button className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium">{comments}</span>
          </button>

          <button className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium">{shares}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
