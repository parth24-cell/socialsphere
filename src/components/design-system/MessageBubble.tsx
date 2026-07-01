import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  content: string;
  isSender: boolean;
  avatarSrc?: string;
  avatarFallback?: string;
  timestamp?: string;
}

export function MessageBubble({
  content,
  isSender,
  avatarSrc,
  avatarFallback = "U",
  timestamp,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isSender ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isSender && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback className="bg-white/5 text-xs text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isSender ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-2 text-sm leading-relaxed",
            isSender
              ? "rounded-2xl rounded-tr-sm bg-primary/20 text-white border border-primary/30 shadow-lg shadow-primary/5"
              : "rounded-2xl rounded-tl-sm bg-white/5 text-white border border-white/10"
          )}
        >
          {content}
        </div>
        {timestamp && (
          <span className="text-[10px] text-muted-foreground mt-1 mx-1">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
