import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserList from "@/components/UserList";
import { AppLayout } from "@/components/navigation/AppLayout";

export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;

  const profileUser = await prisma.user.findFirst({
    where: { profile: { username: resolvedParams.username } },
    include: { profile: true },
  });

  if (!profileUser || !profileUser.profile) return notFound();

  const following = await prisma.follower.findMany({
    where: { followerId: profileUser.id },
    include: {
      following: {
        include: {
          profile: true,
          followers: currentUserId ? { where: { followerId: currentUserId } } : false,
          following: currentUserId ? { where: { followingId: currentUserId } } : false,
        },
      },
    },
  });

  const formattedUsers = following.map((f: { following: { id: string; profile: { username: string; displayName: string | null; avatarUrl: string | null } | null; followers: { length: number }; following: { length: number } } }) => {
    const u = f.following;
    return {
      id: u.id,
      username: u.profile?.username || "unknown",
      displayName: u.profile?.displayName || null,
      avatarUrl: u.profile?.avatarUrl || null,
      isFollowing: currentUserId ? u.followers.length > 0 : false,
      isMutual: currentUserId ? u.following.length > 0 : false,
    };
  });

  return (
    <AppLayout user={session?.user as any}>
      <div className="flex w-full justify-center max-w-7xl mx-auto gap-8 px-4 sm:px-6">
        
        {/* Main List Column */}
        <div className="flex-1 max-w-[660px] w-full min-h-screen border-r border-white/5 pb-24">
          
          {/* Header Panel */}
          <div className="sticky top-0 z-20 bg-zinc-950/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4 shrink-0">
            <Link href={`/${resolvedParams.username}`} className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition text-white/80 hover:text-white active:scale-95">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white leading-tight font-heading">
                {profileUser.profile.displayName || profileUser.profile.username}
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5">Relations</p>
            </div>
          </div>

          {/* Tab Links */}
          <div className="flex border-b border-white/5 select-none bg-white/[0.002]">
            <Link 
              href={`/${resolvedParams.username}/followers`} 
              className="flex-1 text-center py-4 font-bold text-xs uppercase tracking-wider text-white/40 hover:text-white transition-colors"
            >
              Followers
            </Link>
            <Link 
              href={`/${resolvedParams.username}/following`} 
              className="flex-1 text-center py-4 font-bold text-xs uppercase tracking-wider text-amber-500 border-b-2 border-amber-500 bg-white/[0.005]"
            >
              Following
            </Link>
          </div>

          <div className="pt-2">
            <UserList users={formattedUsers} currentUserId={currentUserId} />
          </div>
        </div>

        {/* Info panel sidebar placeholder */}
        <div className="hidden lg:block w-[320px] py-6 h-screen sticky top-0" />
      </div>
    </AppLayout>
  );
}
