import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import Feed from "@/components/Feed";

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        include: {
          author: { select: { id: true, profile: true } },
          images: true,
          _count: { select: { likes: true, comments: true } },
          likes: { where: { userId: session.user.id }, select: { userId: true } },
          bookmarks: { where: { userId: session.user.id }, select: { userId: true } },
        },
      },
    },
  });

  const posts = bookmarks.map(b => b.post);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <div className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">
        <div className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-4">
          <Link href="/home" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
          </Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Bookmark className="w-5 h-5 fill-zinc-900 dark:fill-zinc-50" /> Bookmarks
          </h1>
        </div>
        
        <div className="p-4">
          {posts.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl mt-4">
              You haven't bookmarked any posts yet.
            </div>
          ) : (
            <Feed initialPosts={posts} />
          )}
        </div>
      </div>
    </div>
  );
}
