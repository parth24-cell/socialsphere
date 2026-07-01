"use client";

import { useState, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createStory } from "@/actions/story";
import { uploadMedia } from "@/actions/post";
import StoryViewer from "./StoryViewer";
import { StoryRing } from "@/components/design-system/StoryRing";

type Story = {
  id: string;
  mediaUrl: string;
  expiresAt: Date;
  user: { id: string; profile: any };
  views?: { viewerId: string }[];
};

type StoriesBarProps = {
  storiesGroupedByUser: { [userId: string]: Story[] };
  currentUserId: string;
  currentUserProfile: any;
};

export default function StoriesBar({ storiesGroupedByUser, currentUserId, currentUserProfile }: StoriesBarProps) {
  const [uploading, setUploading] = useState(false);
  const [activeStoryUserId, setActiveStoryUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      const urls = await uploadMedia(formData);
      if (urls && urls.length > 0 && urls[0]) {
        await createStory(urls[0]);
      } else {
        throw new Error("Failed to upload media. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An error occurred while uploading story");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const userIds = Object.keys(storiesGroupedByUser);

  // Sort userIds: Your story -> Unseen stories -> Seen stories
  const sortedUserIds = [...userIds].sort((a, b) => {
    if (a === currentUserId) return -1;
    if (b === currentUserId) return 1;

    const aAllViewed = storiesGroupedByUser[a].every(s => s.views && s.views.length > 0);
    const bAllViewed = storiesGroupedByUser[b].every(s => s.views && s.views.length > 0);

    if (aAllViewed === bAllViewed) return 0;
    return aAllViewed ? 1 : -1;
  });

  return (
    <>
      <div className="flex gap-4 p-5 overflow-x-auto no-scrollbar items-center bg-white/[0.01] border-b border-white/5 scroll-smooth">
        {/* Create Story Button */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-full border border-dashed border-white/20 hover:border-amber-500/50 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all relative p-[2px]"
          >
            <div className="w-full h-full rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/40" />
              ) : (
                <Plus className="w-5 h-5 text-white/60 hover:text-white" />
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 mt-1">Add Story</span>
        </div>

        {/* Story Avatars */}
        {sortedUserIds.map(userId => {
          const stories = storiesGroupedByUser[userId];
          const user = stories[0].user;
          const isMe = userId === currentUserId;
          
          // Check if all stories by this user are viewed
          const allViewed = stories.every(s => s.views && s.views.length > 0);

          return (
            <div key={userId} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer" onClick={() => setActiveStoryUserId(userId)}>
              <StoryRing
                src={user.profile?.avatarUrl}
                fallback={isMe ? currentUserProfile?.displayName?.charAt(0).toUpperCase() || currentUserProfile?.username?.charAt(0).toUpperCase() || "?" : user.profile?.username?.charAt(0).toUpperCase() || "?"}
                hasUnviewedStory={!allViewed}
                size="md"
              />
              <span className="text-xs font-semibold text-white/70 truncate w-14 text-center mt-1">
                {isMe ? "You" : user.profile?.username || "unknown"}
              </span>
            </div>
          );
        })}
      </div>

      {activeStoryUserId && (
        <StoryViewer 
          storiesGroupedByUser={storiesGroupedByUser}
          initialUserId={activeStoryUserId}
          currentUserId={currentUserId}
          onClose={() => setActiveStoryUserId(null)}
        />
      )}
    </>
  );
}
