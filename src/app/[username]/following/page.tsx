import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserList from "@/components/UserList";

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <main className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-6">
          <Link href={`/${resolvedParams.username}`} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{profileUser.profile.displayName || profileUser.profile.username}</h1>
            <p className="text-sm text-zinc-500">Following</p>
          </div>
        </div>

        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <Link href={`/${resolvedParams.username}/followers`} className="flex-1 text-center py-3 font-medium text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
            Followers
          </Link>
          <Link href={`/${resolvedParams.username}/following`} className="flex-1 text-center py-3 font-medium text-indigo-600 border-b-2 border-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
            Following
          </Link>
        </div>

        <UserList users={formattedUsers} currentUserId={currentUserId} />
      </main>
    </div>
  );
}
