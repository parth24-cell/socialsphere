import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import PostCard from "@/components/PostCard";
import { AppLayout } from "@/components/navigation/AppLayout";
import { CommentSection } from "@/components/feed/CommentSection";

export default async function PostPage({ params }: { params: { postId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: {
      author: { select: { id: true, profile: true } },
      images: true,
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.user.id }, select: { userId: true } },
      bookmarks: { where: { userId: session.user.id }, select: { userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, profile: true } }
        }
      }
    }
  });

  if (!post) {
    return (
      <AppLayout user={session.user as any}>
        <div className="w-full max-w-2xl border-r border-white/10 p-8 text-center text-muted-foreground">
          Post not found.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={session.user as any}>
      <div className="w-full max-w-2xl min-h-screen border-r border-white/10">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-4">
          <Link href="/home" className="hidden md:flex p-2 hover:bg-white/10 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-white">Post</h1>
        </div>
        
        <div className="p-4 border-b border-white/10">
          <PostCard post={post} currentUserId={session.user.id} />
        </div>

        <div className="p-6">
          <h2 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Comments ({post.comments.length})
          </h2>
          
          <CommentSection
            postId={post.id}
            comments={post.comments}
            currentUserId={session.user.id}
          />
        </div>
      </div>
    </AppLayout>
  );
}
