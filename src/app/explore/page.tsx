import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";
import { getExplorePosts } from "@/actions/feed";
import { AppLayout } from "@/components/navigation/AppLayout";
import { SearchBar } from "@/components/explore/SearchBar";
import { TrendingTopics } from "@/components/explore/TrendingTopics";
import { CreatorCarousel } from "@/components/explore/CreatorCarousel";
import { CommunityGrid } from "@/components/explore/CommunityGrid";
import { DiscoverConnections } from "@/components/explore/DiscoverConnections";
import { ExploreHero } from "@/components/explore/ExploreHero";
import ClientFeedList from "@/components/ClientFeedList";

export const revalidate = 60; // Cache page for 60 seconds

export default async function ExplorePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch suggested creators for recommendations
  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: { not: session.user.id },
      profile: { isNot: null },
      blockedBy: { none: { blockerId: session.user.id } },
      blocking: { none: { blockedId: session.user.id } }
    },
    take: 8,
    include: {
      profile: true
    }
  });

  const formattedCreators = suggestedUsers.map(u => ({
    id: u.id,
    username: u.profile?.username || "unknown",
    displayName: u.profile?.displayName || null,
    avatarUrl: u.profile?.avatarUrl || null,
    bio: u.profile?.bio || null
  }));

  // Fetch initial explore trending posts
  const trendingPosts = await getExplorePosts(1, 10);

  return (
    <AppLayout user={session.user as any}>
      <div className="flex w-full justify-center max-w-7xl mx-auto gap-8 px-4 sm:px-6">
        
        {/* Explore Main Panel */}
        <div className="flex-1 max-w-[660px] w-full min-h-screen border-r border-white/5 pb-24 space-y-6">
          
          {/* Header Panel */}
          <div className="sticky top-0 z-20 bg-zinc-950/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <Link href="/home" className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition text-white/80 hover:text-white active:scale-95">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-white leading-tight font-heading flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" /> Explore
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5">Discover Curation</p>
              </div>
            </div>
          </div>

          {/* Spotlight Search Input */}
          <div className="px-6">
            <SearchBar />
          </div>

          {/* Discover Your Next Connection (Unique Highlight Card) */}
          <DiscoverConnections suggestedCreators={formattedCreators} />

          {/* Curated magazine Hero Section */}
          <ExploreHero />

          {/* Trending conversation chips */}
          <TrendingTopics onTopicClick={(topic) => {
            // Re-route to search trigger query
            window.location.href = `/search?q=${encodeURIComponent(topic)}`;
          }} />

          {/* Creators Horizontal slider */}
          <CreatorCarousel creators={formattedCreators} />

          {/* Communities Destinations Grid */}
          <CommunityGrid />

          {/* Explore Curation Feed */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-white/40 px-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <h4 className="text-[10px] uppercase tracking-wider font-bold">Trending across SocialSphere</h4>
            </div>
            
            <div className="px-2">
              <ClientFeedList 
                initialPosts={trendingPosts} 
                currentUserId={session.user.id} 
                fetchNextPage={getExplorePosts}
              />
            </div>
          </div>

        </div>

        {/* Sidebar placeholder */}
        <div className="hidden lg:block w-[320px] py-6 h-screen sticky top-0" />

      </div>
    </AppLayout>
  );
}
