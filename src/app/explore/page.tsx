import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import PostCard from "@/components/PostCard";

export const revalidate = 60; // Cache page for 60 seconds

export default async function ExplorePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch top 50 posts by most likes, excluding user's own posts
  const trendingPosts = await prisma.post.findMany({
    where: {
      authorId: { not: session.user.id }
    },
    orderBy: {
      likes: { _count: 'desc' }
    },
    take: 50,
    include: {
      author: { select: { id: true, profile: true } },
      images: true,
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.user.id }, select: { userId: true } },
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <main className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition">
              <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
            </Link>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-500" /> Explore
            </h1>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 border-b border-indigo-100 dark:border-indigo-900/50">
          <h2 className="font-semibold text-indigo-900 dark:text-indigo-100">Trending across SocialSphere</h2>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">Discover popular posts from the community.</p>
        </div>

        {/* Feed */}
        <div className="p-4 space-y-4">
          {trendingPosts.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">Nothing trending yet.</div>
          ) : (
            trendingPosts.map((post: any) => (
              <PostCard key={post.id} post={post as any} currentUserId={session?.user?.id!} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
