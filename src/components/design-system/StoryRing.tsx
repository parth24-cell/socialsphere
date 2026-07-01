import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface StoryRingProps {
  src?: string;
  fallback: string;
  hasUnviewedStory?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StoryRing({
  src,
  fallback,
  hasUnviewedStory = true,
  size = "md",
  className,
}: StoryRingProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  return (
    <div
      className={cn(
        "relative rounded-full p-[2px] cursor-pointer transition-transform hover:scale-105 active:scale-95",
        hasUnviewedStory
          ? "bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400"
          : "bg-white/10",
        sizeClasses[size],
        className
      )}
    >
      <div className="w-full h-full rounded-full border-[2px] border-black overflow-hidden bg-black">
        <Avatar className="w-full h-full">
          <AvatarImage src={src} className="object-cover" />
          <AvatarFallback className="bg-white/5 text-white">
            {fallback}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
