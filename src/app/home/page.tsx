import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ComposePost from "@/components/ComposePost";
import ClientFeedList from "@/components/ClientFeedList";
import StoriesBar from "@/components/StoriesBar";
import Link from "next/link";
import { User, LogOut, Settings, Home, Search, Bell, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import FollowButton from "@/components/FollowButton";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [rawPosts, activeStories, suggestedUsers, currentProfile] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          { authorId: session.user.id },
          { author: { followers: { some: { followerId: session.user.id } } } }
        ]
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Fetch initial page
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        },
        images: { select: { url: true } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: session.user.id }, select: { userId: true } },
        bookmarks: { where: { userId: session.user.id }, select: { userId: true } },
      },
    }),
    prisma.story.findMany({
      where: { 
        expiresAt: { gt: new Date() },
        OR: [
          { userId: session.user.id },
          { user: { followers: { some: { followerId: session.user.id } } } }
        ]
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        mediaUrl: true,
        expiresAt: true,
        userId: true,
        user: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                avatarUrl: true
              }
            }
          }
        },
        views: { where: { viewerId: session.user.id }, select: { viewerId: true } }
      }
    }),
    prisma.user.findMany({
      where: {
        id: { not: session.user.id },
        followers: { none: { followerId: session.user.id } },
        blockedBy: { none: { blockerId: session.user.id } },
        blocking: { none: { blockedId: session.user.id } }
      },
      take: 30,
      include: { 
        profile: true,
        _count: { select: { followers: true } }
      },
    }),
    prisma.profile.findUnique({
      where: { userId: session.user.id }
    })
  ]);

  // Sort suggested users: prefer those with profile pictures, then by follower count
  const sortedSuggestedUsers = suggestedUsers.sort((a, b) => {
    const aHasPic = a.profile?.avatarUrl ? 1 : 0;
    const bHasPic = b.profile?.avatarUrl ? 1 : 0;
    if (aHasPic !== bHasPic) {
      return bHasPic - aHasPic; // Profile pic first
    }
    return (b._count?.followers || 0) - (a._count?.followers || 0); // Then by followers desc
  });

  const top10Suggested = sortedSuggestedUsers.slice(0, 10);
  const top3Suggested = sortedSuggestedUsers.slice(0, 3);

  // Algorithmic Feed Ranking (Hacker News Gravity Formula)
  const rankedPosts = rawPosts.sort((a: any, b: any) => {
    const ageAInHours = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
    const scoreA = (a._count.likes * 2 + a._count.comments * 3) / Math.pow(ageAInHours + 2, 1.5);

    const ageBInHours = (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);
    const scoreB = (b._count.likes * 2 + b._count.comments * 3) / Math.pow(ageBInHours + 2, 1.5);

    return scoreB - scoreA;
  });

  // Group stories by user
  const storiesGroupedByUser = activeStories.reduce((acc: any, story: any) => {
    if (!acc[story.userId]) acc[story.userId] = [];
    acc[story.userId].push(story as any);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto flex justify-center">
        
        {/* Left Sidebar (Desktop) */}
        <div className="hidden sm:flex flex-col w-64 p-2 xl:p-4 h-screen sticky top-0 border-r border-zinc-200 dark:border-zinc-800">
          <Link href="/home" className="text-2xl font-bold text-indigo-600 dark:text-indigo-500 mb-8 px-4 mt-2">
            SocialSphere
          </Link>
          
          <nav className="flex-1 space-y-1">
            <Link href="/home" className="flex items-center gap-4 px-4 py-3 rounded-full bg-zinc-200 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-50">
              <Home className="w-6 h-6" /> Home
            </Link>
            <Link href="/explore" className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 font-medium text-zinc-700 dark:text-zinc-300 transition">
              <Search className="w-6 h-6" /> Explore
            </Link>
            <Link href="/notifications" className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 font-medium text-zinc-700 dark:text-zinc-300 transition">
              <Bell className="w-6 h-6" /> Notifications
            </Link>
            <Link href="/messages" className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 font-medium text-zinc-700 dark:text-zinc-300 transition">
              <Mail className="w-6 h-6" /> Messages
            </Link>
            <Link href={`/${currentProfile?.username}`} className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 font-medium text-zinc-700 dark:text-zinc-300 transition">
              <User className="w-6 h-6" /> Profile
            </Link>
            <Link href="/settings" className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 font-medium text-zinc-700 dark:text-zinc-300 transition">
              <Settings className="w-6 h-6" /> Settings
            </Link>
          </nav>
          
          <div className="mt-auto mb-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex flex-shrink-0 items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden">
                {currentProfile?.avatarUrl ? (
                  <img src={currentProfile.avatarUrl} alt="" className="w-full h-full object-cover object-center" />
                ) : (
                  currentProfile?.username?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{currentProfile?.displayName || currentProfile?.username}</p>
                <p className="text-xs text-zinc-500 truncate">@{currentProfile?.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed Area */}
        <main className="flex-1 max-w-[700px] w-full min-h-screen border-r border-zinc-200 dark:border-zinc-800">
          <div className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Home</h1>
          </div>
          
          <StoriesBar 
            storiesGroupedByUser={storiesGroupedByUser} 
            currentUserId={session?.user?.id!}
            currentUserProfile={currentProfile} 
          />

          <div className="p-0 sm:p-2 border-b border-zinc-200 dark:border-zinc-800">
            <ComposePost />
          </div>
          <div className="p-0 sm:p-4">
            <ClientFeedList 
              initialPosts={rankedPosts} 
              currentUserId={session.user.id!} 
              suggestedUsers={top10Suggested}
            />
          </div>
        </main>

        {/* Right Sidebar (Trends/Suggestions) */}
        <div className="hidden lg:block w-[350px] p-4 h-screen sticky top-0">
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-4">Who to follow</h2>
            <div className="space-y-4">
              {top3Suggested.length === 0 ? (
                <p className="text-sm text-zinc-500">No suggestions right now.</p>
              ) : (
                top3Suggested.map(u => (
                  <div key={u.id} className="flex items-center justify-between gap-2">
                    <Link href={`/${u.profile?.username}`} className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                        {u.profile?.avatarUrl ? (
                          <img src={u.profile.avatarUrl} alt="" className="w-full h-full object-cover object-center" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500">
                            {u.profile?.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">{u.profile?.displayName || u.profile?.username}</p>
                        <p className="text-xs text-zinc-500 truncate">@{u.profile?.username}</p>
                      </div>
                    </Link>
                    <FollowButton targetUserId={u.id} initialIsFollowing={false} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-4">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-4">What's happening</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Trending</p>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50">#Nextjs</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">10.5K posts</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Technology</p>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50">Prisma ORM</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">5.2K posts</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
