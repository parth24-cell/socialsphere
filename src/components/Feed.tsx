import { prisma } from "@/lib/prisma";
import PostCard from "./PostCard";
import { auth } from "@/auth";

export default async function Feed({ initialPosts }: { initialPosts?: any[] }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const posts = initialPosts || await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          profile: true,
        },
      },
      images: {
        select: { url: true },
      },
      _count: {
        select: { likes: true, comments: true },
      },
      likes: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
      bookmarks: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
    },
  });

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
        No posts yet. Be the first to say something!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post as any} currentUserId={session?.user?.id!} />
      ))}
    </div>
  );
}
