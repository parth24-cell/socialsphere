import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import PostCard from "@/components/PostCard";
import Image from "next/image";

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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
        <div className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-500">
          Post not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <div className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">
        <div className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-4">
          <Link href="/home" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
          </Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Post</h1>
        </div>
        
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <PostCard post={post} currentUserId={session.user.id} />
        </div>

        <div className="p-4">
          <h2 className="font-bold text-lg mb-4 text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Comments ({post.comments.length})
          </h2>
          
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <p className="text-zinc-500 text-sm">No comments yet. Be the first to reply!</p>
            ) : (
              post.comments.map(comment => (
                <div key={comment.id} className="flex gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <Link href={`/${comment.author.profile?.username}`} className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    {comment.author.profile?.avatarUrl ? (
                      <Image src={comment.author.profile.avatarUrl} alt="" width={32} height={32} className="object-cover object-center w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500 text-xs">
                        {comment.author.profile?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/${comment.author.profile?.username}`} className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 hover:underline">
                        {comment.author.profile?.displayName || comment.author.profile?.username}
                      </Link>
                      <span className="text-xs text-zinc-500">
                        {new Date(comment.createdAt).toLocaleDateString('en-US')}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
