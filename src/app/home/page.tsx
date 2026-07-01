import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ComposePost from "@/components/ComposePost";
import ClientFeedList from "@/components/ClientFeedList";
import StoriesBar from "@/components/StoriesBar";
import Link from "next/link";
import { User, LogOut, Settings, Home, Search, Bell, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import FollowButton from "@/components/FollowButton";
import { AppLayout } from "@/components/navigation/AppLayout";
export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch the list of users the current user follows
  const followingRecords = await prisma.follower.findMany({
    where: { followerId: session.user.id, status: "ACCEPTED" },
    select: { followingId: true }
  });
  
  const followedUserIds = followingRecords.map(record => record.followingId);
  const allowedUserIds = [...followedUserIds, session.user.id];

  const [rawPosts, activeStories, suggestedUsers, currentProfile] = await Promise.all([
    prisma.post.findMany({
      where: {
        authorId: { in: allowedUserIds }
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
        userId: { in: allowedUserIds }
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
    <AppLayout user={session.user as any}>
      <div className="flex w-full justify-center max-w-7xl mx-auto gap-8 px-4 sm:px-6">
        {/* Main Feed Area */}
        <div className="flex-1 max-w-[660px] w-full min-h-screen">
          <div className="sticky top-0 z-10 bg-background/60 backdrop-blur-xl border-b border-white/5 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-white font-heading">Home</h1>
          </div>
          
          <StoriesBar 
            storiesGroupedByUser={storiesGroupedByUser} 
            currentUserId={session?.user?.id!}
            currentUserProfile={currentProfile} 
          />

          <div className="py-6">
            <ComposePost />
          </div>
          
          <div className="py-2">
            <ClientFeedList 
              initialPosts={rankedPosts} 
              currentUserId={session.user.id!} 
              suggestedUsers={top10Suggested}
            />
          </div>
        </div>

        {/* Right Sidebar (Trends/Suggestions) */}
        <div className="hidden lg:block w-[320px] py-6 h-screen sticky top-0 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-lg">
            <h2 className="font-bold text-sm uppercase tracking-wider text-white/50 mb-4">Who to follow</h2>
            <div className="space-y-4">
              {top3Suggested.length === 0 ? (
                <p className="text-xs text-white/40">No suggestions right now.</p>
              ) : (
                top3Suggested.map(u => (
                  <div key={u.id} className="flex items-center justify-between gap-3">
                    <Link href={`/${u.profile?.username}`} className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                        {u.profile?.avatarUrl ? (
                          <img src={u.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-white/30 text-sm">
                            {u.profile?.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate hover:underline">{u.profile?.displayName || u.profile?.username}</p>
                        <p className="text-[10px] text-white/40 truncate">@{u.profile?.username}</p>
                      </div>
                    </Link>
                    <FollowButton targetUserId={u.id} initialIsFollowing={false} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 shadow-lg">
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
    </AppLayout>
  );
}
