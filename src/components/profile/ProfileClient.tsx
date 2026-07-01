"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/navigation/AppLayout";
import { AvatarSection } from "./AvatarSection";
import { ProfileStats } from "./ProfileStats";
import { ProfileActions } from "./ProfileActions";
import { BioCard } from "./BioCard";
import { ProfileTabs } from "./ProfileTabs";
import { PostsGrid } from "./PostsGrid";
import { MediaGallery } from "./MediaGallery";
import { EmptyState } from "./EmptyState";
import { EditProfileDialog } from "./EditProfileDialog";
import PostCard from "@/components/PostCard";
import { ArrowLeft, Calendar, Link as LinkIcon, MapPin, Bookmark, MessageSquare, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type ProfileClientProps = {
  profileUser: any;
  currentUserId: string | undefined;
  sessionUser: any;
  bookmarkedPosts: any[];
  userStoriesCount: number;
};

type TabOption = "POSTS" | "MEDIA" | "REPLIES" | "SAVED" | "ABOUT";

export default function ProfileClient({
  profileUser,
  currentUserId,
  sessionUser,
  bookmarkedPosts,
  userStoriesCount
}: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<TabOption>("POSTS");
  const [isEditing, setIsEditing] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  const isCurrentUser = currentUserId === profileUser.id;
  const isFollowing = currentUserId ? profileUser.followers.length > 0 : false;
  
  // Load simulated interests tags from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`interests_${profileUser.profile.username}`);
    if (saved) {
      try {
        setInterests(JSON.parse(saved));
      } catch (e) {}
    }
  }, [profileUser.profile.username]);

  // Handle location and website cleanups
  const websiteDisplay = profileUser.profile.website?.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <AppLayout user={sessionUser}>
      <div className="flex w-full justify-center max-w-7xl mx-auto gap-8 px-4 sm:px-6">
        
        {/* Profile Main Container */}
        <div className="flex-1 max-w-[660px] w-full min-h-screen border-r border-white/5 pb-24">
          
          {/* Header Panel */}
          <div className="sticky top-0 z-20 bg-zinc-950/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4 shrink-0">
            <Link href="/home" className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition text-white/80 hover:text-white active:scale-95">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white leading-tight font-heading">
                {profileUser.profile.displayName || profileUser.profile.username}
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5">
                {profileUser._count.posts} {profileUser._count.posts === 1 ? "Post" : "Posts"}
              </p>
            </div>
          </div>

          {/* Hero Banner Area */}
          <div className="h-48 w-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-b border-white/5 relative overflow-hidden group select-none">
            {profileUser.profile.coverUrl ? (
              <img 
                src={profileUser.profile.coverUrl} 
                alt="Profile Cover" 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-zinc-900 to-zinc-900 opacity-60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
          </div>

          {/* Avatar and Action Panel Row */}
          <div className="flex justify-between items-end px-6 mb-4 relative z-10">
            <AvatarSection
              avatarUrl={profileUser.profile.avatarUrl}
              username={profileUser.profile.username}
              hasStory={userStoriesCount > 0}
              isVerified={profileUser.role === "VERIFIED" || profileUser.role === "ADMIN"}
            />
            
            <ProfileActions
              profileUserId={profileUser.id}
              isCurrentUser={isCurrentUser}
              initialIsFollowing={isFollowing}
              onEditClick={() => setIsEditing(true)}
            />
          </div>

          {/* User Display Info & Description */}
          <div className="px-6 space-y-4 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white font-heading">
                {profileUser.profile.displayName || profileUser.profile.username}
              </h2>
              <p className="text-xs text-white/40 font-mono">@{profileUser.profile.username}</p>
            </div>

            {/* Profile Bio */}
            <BioCard bio={profileUser.profile.bio} />

            {/* Links and Join date */}
            <div className="flex flex-wrap gap-4 text-xs text-white/40 font-medium select-none px-6">
              {profileUser.profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white/40" />
                  <span>{profileUser.profile.location}</span>
                </div>
              )}
              {profileUser.profile.website && (
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-white/40" />
                  <a 
                    href={profileUser.profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-amber-500 hover:underline"
                  >
                    {websiteDisplay}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                <span>Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Stats counter */}
            <div className="pt-2">
              <ProfileStats
                username={profileUser.profile.username}
                postsCount={profileUser._count.posts}
                followersCount={profileUser._count.followers}
                followingCount={profileUser._count.following}
              />
            </div>
          </div>

          {/* Profile Navigation Tabs */}
          <div className="my-2">
            <ProfileTabs
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              showSaved={isCurrentUser}
            />
          </div>

          {/* Tab Views Render */}
          <div className="mt-2">
            {activeTab === "POSTS" && (
              <PostsGrid posts={profileUser.posts} currentUserId={currentUserId || ""} />
            )}

            {activeTab === "MEDIA" && (
              <MediaGallery posts={profileUser.posts} />
            )}

            {activeTab === "REPLIES" && (
              <div className="py-8 px-6">
                <EmptyState
                  title="No replies yet"
                  description="Replies and comments on other posts will display here."
                  icon={<MessageSquare className="w-8 h-8" />}
                />
              </div>
            )}

            {activeTab === "SAVED" && isCurrentUser && (
              <div className="space-y-4">
                <div className="px-6 py-2 select-none border-b border-white/5 bg-white/[0.002]">
                  <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-amber-500" /> Bookmarked Posts
                  </span>
                </div>
                {bookmarkedPosts.length === 0 ? (
                  <div className="py-8 px-6">
                    <EmptyState
                      title="No bookmarks saved"
                      description="Bookmark posts to read them later. Saved posts are private to you."
                      icon={<Bookmark className="w-8 h-8" />}
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {bookmarkedPosts.map((post) => (
                      <PostCard key={post.id} post={post} currentUserId={currentUserId || ""} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "ABOUT" && (
              <div className="px-6 py-6 space-y-6">
                {/* Simulated Creator Tags */}
                {interests.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs uppercase tracking-wider text-white/40 font-bold">Creator Interests</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info summary */}
                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-white/40 font-bold">Profile Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-white/40 mb-1">User Role</span>
                      <span className="block font-bold text-white uppercase tracking-wider">{profileUser.role}</span>
                    </div>
                    <div>
                      <span className="block text-white/40 mb-1">Status</span>
                      <span className="block font-bold text-emerald-400 uppercase tracking-wider">{profileUser.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Suggested follows sidebar */}
        <div className="hidden lg:block w-[320px] py-6 h-screen sticky top-0 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-lg select-none">
            <h2 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4 font-heading">What's happening</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase font-semibold">Trending</p>
                <p className="font-bold text-xs text-white mt-0.5 hover:underline cursor-pointer">#Nextjs</p>
                <p className="text-[10px] text-white/40 mt-0.5">10.5K posts</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-semibold">Technology</p>
                <p className="font-bold text-xs text-white mt-0.5 hover:underline cursor-pointer">Prisma ORM</p>
                <p className="text-[10px] text-white/40 mt-0.5">4.2K posts</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal Dialog */}
      <AnimatePresence>
        {isEditing && (
          <EditProfileDialog
            profile={profileUser.profile}
            onClose={() => setIsEditing(false)}
            onSuccess={() => {
              // Reload page or force refresh to hydrate new server states
              window.location.reload();
            }}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
