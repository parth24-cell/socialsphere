import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import PostCard from "@/components/PostCard";
import FollowButton from "@/components/FollowButton";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const query = searchParams.q || "";
  const type = searchParams.type || "posts"; // 'posts' or 'users'

  let posts: any[] = [];
  let users: any[] = [];

  if (query) {
    if (type === "posts") {
      posts = await prisma.post.findMany({
        where: {
          content: { contains: query, mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, profile: true } },
          images: true,
          _count: { select: { likes: true, comments: true } },
          likes: { where: { userId: session?.user?.id }, select: { userId: true } },
        },
      });
    } else {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { profile: { username: { contains: query, mode: "insensitive" } } },
            { profile: { displayName: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          profile: true,
          followers: { where: { followerId: session?.user?.id } },
        },
      });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <main className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">
        
        {/* Header & Search Input */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/home" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition">
              <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
            </Link>
            
            <form action="/search" method="GET" className="flex-1 relative">
              <input type="hidden" name="type" value={type} />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search SocialSphere"
                className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-50 outline-none border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition"
              />
              <SearchIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-2.5" />
            </form>
          </div>
        </div>

        {/* Tabs */}
        {query && (
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=posts`}
              className={`flex-1 text-center py-3 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition ${
                type === "posts" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-zinc-500"
              }`}
            >
              Posts
            </Link>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=users`}
              className={`flex-1 text-center py-3 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition ${
                type === "users" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-zinc-500"
              }`}
            >
              People
            </Link>
          </div>
        )}

        {/* Results */}
        <div className="p-4 space-y-4">
          {!query && (
            <div className="text-center py-10 text-zinc-500">
              Type something to search for users or posts.
            </div>
          )}

          {query && type === "posts" && posts.length === 0 && (
            <div className="text-center py-10 text-zinc-500">No posts found for "{query}"</div>
          )}

          {query && type === "users" && users.length === 0 && (
            <div className="text-center py-10 text-zinc-500">No people found for "{query}"</div>
          )}

          {type === "posts" && posts.map(post => (
            <PostCard key={post.id} post={post} currentUserId={session?.user?.id!} />
          ))}

          {type === "users" && users.map(user => {
            if (!user.profile) return null;
            const isCurrentUser = user.id === session?.user?.id;
            const isFollowing = user.followers.length > 0;
            
            return (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Link href={`/${user.profile.username}`} className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600">
                    {user.profile.username.charAt(0).toUpperCase()}
                  </Link>
                  <div>
                    <Link href={`/${user.profile.username}`} className="font-bold text-zinc-900 dark:text-zinc-50 hover:underline">
                      {user.profile.displayName || user.profile.username}
                    </Link>
                    <p className="text-sm text-zinc-500">@{user.profile.username}</p>
                  </div>
                </div>
                {!isCurrentUser && (
                  <FollowButton targetUserId={user.id} initialIsFollowing={isFollowing} />
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
