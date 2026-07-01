import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import Feed from "@/components/Feed";
import { AppLayout } from "@/components/navigation/AppLayout";

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

  const posts = bookmarks.map((b: { post: any }) => b.post);

  return (
    <AppLayout user={session.user as any}>
      <div className="w-full max-w-2xl min-h-screen border-r border-white/10">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-4">
          <Link href="/home" className="hidden md:flex p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 fill-primary text-primary" /> Bookmarks
          </h1>
        </div>
        
        <div className="p-4">
          {posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border border-white/10 rounded-2xl mt-4 bg-white/5">
              You haven't bookmarked any posts yet.
            </div>
          ) : (
            <Feed initialPosts={posts} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
