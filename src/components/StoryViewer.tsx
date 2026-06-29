"use client";

import { useState, useEffect, useRef } from "react";
import { X, Trash2, Eye, Send, Loader2 } from "lucide-react";
import { markStoryAsViewed, deleteStory, getStoryViews } from "@/actions/story";
import { getOrCreateConversation, sendMessage } from "@/actions/messages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Story = {
  id: string;
  mediaUrl: string;
  expiresAt: Date;
  user: { id: string; profile: any };
};

type StoryViewerProps = {
  storiesGroupedByUser: { [userId: string]: Story[] };
  initialUserId: string;
  currentUserId: string;
  onClose: () => void;
};

export default function StoryViewer({ storiesGroupedByUser, initialUserId, currentUserId, onClose }: StoryViewerProps) {
  const router = useRouter();
  const userIds = Object.keys(storiesGroupedByUser);
  
  const [activeUserId, setActiveUserId] = useState(initialUserId);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [replyText, setReplyText] = useState("");
  const [viewers, setViewers] = useState<any[]>([]);
  const [showViewers, setShowViewers] = useState(false);
  
  const activeUserStories = storiesGroupedByUser[activeUserId] || [];
  const currentStory = activeUserStories[activeStoryIndex];
  const isMe = activeUserId === currentUserId;

  const downTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mark as viewed and reset progress when story changes
  useEffect(() => {
    if (currentStory) {
      setProgress(0);
      setIsLoaded(false);
      markStoryAsViewed(currentStory.id);
      
      if (isMe) {
        getStoryViews(currentStory.id).then(setViewers).catch(console.error);
      }
    }
  }, [currentStory, isMe]);

  // Progress timer
  useEffect(() => {
    if (isPaused || !isLoaded || showViewers) return;

    timerRef.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100)); // clamp to 100
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isLoaded, showViewers]);

  const handleNext = () => {
    if (activeStoryIndex < activeUserStories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      // Go to next user
      const currentUserIndex = userIds.indexOf(activeUserId);
      if (currentUserIndex < userIds.length - 1) {
        setActiveUserId(userIds[currentUserIndex + 1]);
        setActiveStoryIndex(0);
      } else {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (progress >= 100) {
      handleNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else {
      const currentUserIndex = userIds.indexOf(activeUserId);
      if (currentUserIndex > 0) {
        const prevUserId = userIds[currentUserIndex - 1];
        setActiveUserId(prevUserId);
        setActiveStoryIndex(storiesGroupedByUser[prevUserId].length - 1);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Ignore down if clicking on inputs or buttons
    if ((e.target as HTMLElement).closest('button, input, form')) return;
    downTime.current = Date.now();
    setIsPaused(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, form')) return;
    setIsPaused(false);
    
    if (Date.now() - downTime.current < 200) {
      // It's a tap
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width * 0.3) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const handleDelete = async () => {
    if (!currentStory) return;
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      await deleteStory(currentStory.id);
      toast.success("Story deleted");
      
      // Remove from UI state (or close if none left)
      const updatedStories = [...activeUserStories];
      updatedStories.splice(activeStoryIndex, 1);
      
      if (updatedStories.length === 0) {
        const currentUserIndex = userIds.indexOf(activeUserId);
        if (currentUserIndex < userIds.length - 1) {
          setActiveUserId(userIds[currentUserIndex + 1]);
          setActiveStoryIndex(0);
        } else if (currentUserIndex > 0) {
          setActiveUserId(userIds[currentUserIndex - 1]);
          setActiveStoryIndex(0);
        } else {
          onClose();
        }
      } else {
        if (activeStoryIndex >= updatedStories.length) {
          setActiveStoryIndex(updatedStories.length - 1);
        }
      }
      router.refresh(); 
    } catch (e) {
      toast.error("Failed to delete story");
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsPaused(true);
    try {
      const conv = await getOrCreateConversation(activeUserId);
      await sendMessage(conv.id, `[Story Reply]: ${replyText}`, []);
      toast.success("Reply sent!");
      setReplyText("");
      setIsPaused(false);
    } catch (e) {
      toast.error("Failed to send reply");
      setIsPaused(false);
    }
  };
  
  const sendReaction = async (emoji: string) => {
    setIsPaused(true);
    try {
      const conv = await getOrCreateConversation(activeUserId);
      await sendMessage(conv.id, `Reacted to your story: ${emoji}`, []);
      toast.success(`Reacted ${emoji}`);
    } catch (e) {
      toast.error("Failed to react");
    } finally {
      setIsPaused(false);
    }
  };

  const [renderTime] = useState(() => Date.now());

  if (!currentStory) return null;

  const timeLeftMs = new Date(currentStory.expiresAt).getTime() - renderTime;
  const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minsLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  const timeLeftStr = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m left` : `${minsLeft}m left`;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center font-sans">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-50">
        <X className="w-8 h-8" />
      </button>
      
      <div className="w-full max-w-[400px] h-full sm:h-[90vh] sm:rounded-2xl relative flex flex-col bg-zinc-900 overflow-hidden">
        
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
          {activeUserStories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-75 ease-linear`} 
                style={{ width: i < activeStoryIndex ? '100%' : i === activeStoryIndex ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-white flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
              {currentStory.user.profile?.avatarUrl ? (
                <img src={currentStory.user.profile.avatarUrl} alt="" className="w-full h-full object-cover object-center" />
              ) : (
                currentStory.user.profile?.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-sm drop-shadow-md">
                {currentStory.user.profile?.username || "unknown"}
              </span>
              <span className="text-white/80 text-xs drop-shadow-md">
                {timeLeftStr}
              </span>
            </div>
          </div>
          {isMe && (
            <button onClick={handleDelete} className="p-2 text-white/70 hover:text-red-500 drop-shadow-md">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Media Area */}
        <div 
          className="flex-1 relative flex items-center justify-center cursor-pointer select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          {!isLoaded && (
            <Loader2 className="w-8 h-8 animate-spin text-white/50 absolute" />
          )}
          <img 
            src={currentStory.mediaUrl} 
            alt="Story" 
            className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            draggable={false}
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          {isMe ? (
            <div className="flex justify-center">
              <button 
                onClick={() => setShowViewers(true)}
                className="flex items-center gap-2 text-white/90 hover:text-white bg-black/40 px-4 py-2 rounded-full backdrop-blur-md"
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium text-sm">{viewers.length} Viewers</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 justify-between px-2">
                {['❤️', '😂', '😮', '😢', '🔥'].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => sendReaction(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <form onSubmit={handleReply} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${currentStory.user.profile?.username}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  className="flex-1 bg-black/40 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/50 backdrop-blur-md text-sm"
                />
                <button type="submit" disabled={!replyText.trim()} className="p-2 bg-indigo-500 rounded-full text-white disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
        
        {/* Viewers Bottom Sheet */}
        {showViewers && (
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-zinc-900 rounded-t-2xl z-30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-bold text-white">Viewers ({viewers.length})</h3>
              <button onClick={() => setShowViewers(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {viewers.length === 0 ? (
                <div className="text-center text-zinc-500 mt-4">No views yet</div>
              ) : (
                viewers.map((v, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                      {v.profile?.avatarUrl ? (
                        <img src={v.profile.avatarUrl} alt="" className="w-full h-full object-cover object-center" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold">
                          {v.profile?.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-white">{v.profile?.username || "unknown"}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
