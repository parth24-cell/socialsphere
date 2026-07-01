import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { AppLayout } from "@/components/navigation/AppLayout";
import { SearchBar } from "@/components/explore/SearchBar";
import { SearchFilters } from "@/components/explore/SearchFilters";
import { SearchResults } from "@/components/explore/SearchResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const query = resolvedParams.q || "";
  const type = (resolvedParams.type || "all") as "all" | "posts" | "users";

  let posts: any[] = [];
  let users: any[] = [];

  if (query) {
    const promises: Promise<any>[] = [];

    if (type === "posts" || type === "all") {
      promises.push(
        prisma.post.findMany({
          where: {
            content: { contains: query, mode: "insensitive" },
            deletedAt: null,
            visibility: "PUBLIC"
          },
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, profile: true } },
            images: true,
            _count: { select: { likes: true, comments: true } },
            likes: { where: { userId: session?.user?.id }, select: { userId: true } },
            bookmarks: { where: { userId: session?.user?.id }, select: { userId: true } },
          },
        }).then(res => {
          posts = res;
        })
      );
    }

    if (type === "users" || type === "all") {
      promises.push(
        prisma.user.findMany({
          where: {
            OR: [
              { profile: { username: { contains: query, mode: "insensitive" } } },
              { profile: { displayName: { contains: query, mode: "insensitive" } } },
            ],
            id: { not: session?.user?.id }
          },
          include: {
            profile: true,
            followers: { where: { followerId: session?.user?.id } },
          },
        }).then(res => {
          users = res;
        })
      );
    }

    await Promise.all(promises);
  }

  return (
    <AppLayout user={session?.user as any}>
      <div className="flex w-full justify-center max-w-7xl mx-auto gap-8 px-4 sm:px-6">
        
        {/* Search Results Column */}
        <div className="flex-1 max-w-[660px] w-full min-h-screen border-r border-white/5 pb-24 space-y-6">
          
          {/* Header Panel */}
          <div className="sticky top-0 z-20 bg-zinc-950/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <Link href="/explore" className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition text-white/80 hover:text-white active:scale-95">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-white leading-tight font-heading flex items-center gap-2">
                  <SearchIcon className="w-4 h-4 text-amber-500" /> Search Results
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5">Spotlight Queries</p>
              </div>
            </div>
          </div>

          {/* Search bar input focus */}
          <div className="px-6">
            <SearchBar initialQuery={query} />
          </div>

          {/* Filters Tag Bar (All, Posts, Users) */}
          {query && (
            <SearchFilters 
              activeFilter={type} 
              onChangeFilter={(filter) => {
                // Navigate with new query parameter filter type
                window.location.href = `/search?q=${encodeURIComponent(query)}&type=${filter}`;
              }}
            />
          )}

          {/* Search results list */}
          <div className="pt-2">
            <SearchResults 
              query={query} 
              activeFilter={type} 
              posts={posts} 
              users={users} 
              currentUserId={session?.user?.id!} 
            />
          </div>

        </div>

        {/* Sidebar placeholder */}
        <div className="hidden lg:block w-[320px] py-6 h-screen sticky top-0" />

      </div>
    </AppLayout>
  );
}
