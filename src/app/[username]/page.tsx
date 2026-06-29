import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import FollowButton from "@/components/FollowButton";
import StartChatButton from "@/components/StartChatButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  console.log("Route username:", resolvedParams.username);
  console.log("Logged in user:", session?.user);
  const currentUserId = session?.user?.id;

  const profileUser = await prisma.user.findFirst({
    where: { profile: { username: resolvedParams.username } },
    include: {
      profile: true,
      _count: {
        select: { followers: true, following: true, posts: true },
      },
      followers: currentUserId ? { where: { followerId: currentUserId } } : false,
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, profile: true } },
          images: true,
          _count: { select: { likes: true, comments: true } },
          likes: currentUserId ? { where: { userId: currentUserId }, select: { userId: true } } : false,
        },
      },
    },
  });

  if (!profileUser || !profileUser.profile) {
    return notFound();
  }

  const isCurrentUser = currentUserId === profileUser.id;
  const isFollowing = currentUserId ? profileUser.followers.length > 0 : false;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <main className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-6">
          <Link href="/home" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{profileUser.profile.displayName || profileUser.profile.username}</h1>
            <p className="text-sm text-zinc-500">{profileUser._count.posts} posts</p>
          </div>
        </div>

        {/* Banner & Avatar */}
        <div className="h-48 bg-zinc-200 dark:bg-zinc-800 w-full relative overflow-hidden">
          {profileUser.profile.coverUrl && (
            <img src={profileUser.profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>
        
        <div className="relative w-32 h-32 -mt-16 ml-4 rounded-full border-4 border-white dark:border-zinc-900 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-4xl font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0 overflow-hidden">
          {profileUser.profile.avatarUrl ? (
            <img src={profileUser.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover object-center" />
          ) : (
            profileUser.profile.username.charAt(0).toUpperCase()
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 pt-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{profileUser.profile.displayName || profileUser.profile.username}</h2>
              <p className="text-zinc-500">@{profileUser.profile.username}</p>
            </div>
            {!isCurrentUser && currentUserId && (
              <div className="flex gap-2">
                <StartChatButton targetUserId={profileUser.id} />
                <FollowButton targetUserId={profileUser.id} initialIsFollowing={isFollowing} />
              </div>
            )}
            {isCurrentUser && (
              <Link href="/settings" className="px-4 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                Edit profile
              </Link>
            )}
          </div>

          {profileUser.profile.bio && (
            <p className="text-zinc-900 dark:text-zinc-100 mb-4 whitespace-pre-wrap">{profileUser.profile.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-4">
            {profileUser.profile.location && (
              <div className="flex items-center gap-1">
                <span>📍</span> {profileUser.profile.location}
              </div>
            )}
            {profileUser.profile.website && (
              <div className="flex items-center gap-1">
                <span>🔗</span> <a href={profileUser.profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">{profileUser.profile.website.replace(/^https?:\/\//, '')}</a>
              </div>
            )}
          </div>

          <div className="flex gap-4 text-sm">
            <Link href={`/${resolvedParams.username}/following`} className="hover:underline text-zinc-500">
              <span className="font-bold text-zinc-900 dark:text-zinc-50">{profileUser._count.following}</span> Following
            </Link>
            <Link href={`/${resolvedParams.username}/followers`} className="hover:underline text-zinc-500">
              <span className="font-bold text-zinc-900 dark:text-zinc-50">{profileUser._count.followers}</span> Followers
            </Link>
          </div>
        </div>

        {/* Posts */}
        <div className="p-4 space-y-4">
          {profileUser.posts.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">No posts yet.</div>
          ) : (
            profileUser.posts.map((post: any) => (
              <PostCard key={post.id} post={post as any} currentUserId={currentUserId || ""} />
            ))
          )}
        </div>

      </main>
    </div>
  );
}
