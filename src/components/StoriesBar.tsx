"use client";

import { useState, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createStory } from "@/actions/story";
import { uploadMedia } from "@/actions/post";
import StoryViewer from "./StoryViewer";

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
      <div className="flex gap-4 p-4 overflow-x-auto hide-scrollbar border-b border-zinc-200 dark:border-zinc-800 items-center">
        {/* Create Story Button */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition relative p-[2px]"
          >
            <div className="w-full h-full rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              ) : (
                <Plus className="w-6 h-6 text-zinc-500" />
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
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Add Story</span>
        </div>

        {sortedUserIds.length === 0 && (
          <div className="text-sm text-zinc-500 dark:text-zinc-400 ml-4 font-medium">
            No stories available
          </div>
        )}

        {/* Story Avatars */}
        {sortedUserIds.map(userId => {
          const stories = storiesGroupedByUser[userId];
          const user = stories[0].user;
          const isMe = userId === currentUserId;
          
          // Check if all stories by this user are viewed
          const allViewed = stories.every(s => s.views && s.views.length > 0);
          
          const ringClass = isMe 
            ? 'bg-zinc-300 dark:bg-zinc-700' // My story indicator
            : allViewed 
              ? 'bg-zinc-300 dark:bg-zinc-700' // Grey if all viewed
              : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'; // Colorful if unviewed

          return (
            <div key={userId} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer" onClick={() => setActiveStoryUserId(userId)}>
              <div className={`w-[60px] h-[60px] rounded-full p-[2px] ${ringClass}`}>
                <div className="w-full h-full rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xl flex-shrink-0 overflow-hidden">
                  {user.profile?.avatarUrl ? (
                    <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover object-center" />
                  ) : (
                    (isMe ? currentUserProfile?.name?.charAt(0).toUpperCase() : user.profile?.username?.charAt(0).toUpperCase())
                  )}
                </div>
              </div>
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50 truncate w-full text-center mt-1">
                {isMe ? "Your Story" : user.profile?.username || "unknown"}
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
