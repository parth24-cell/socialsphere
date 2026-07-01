import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProfileClient from "@/components/profile/ProfileClient";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;

  const profileUser = await prisma.user.findFirst({
    where: { profile: { username: resolvedParams.username } },
    include: {
      profile: true,
      _count: {
        select: { followers: true, following: true, posts: true },
      },
      followers: currentUserId ? { where: { followerId: currentUserId } } : false,
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, profile: true } },
          images: true,
          _count: { select: { likes: true, comments: true } },
          likes: currentUserId ? { where: { userId: currentUserId }, select: { userId: true } } : false,
          bookmarks: currentUserId ? { where: { userId: currentUserId }, select: { userId: true } } : false,
        },
      },
    },
  });

  if (!profileUser || !profileUser.profile) {
    return notFound();
  }

  const isCurrentUser = currentUserId === profileUser.id;

  // Query bookmarks of current user if they are viewing their own profile page
  const bookmarkedRecords = isCurrentUser ? await prisma.bookmark.findMany({
    where: { userId: currentUserId },
    include: {
      post: {
        include: {
          author: { select: { id: true, profile: true } },
          images: true,
          _count: { select: { likes: true, comments: true } },
          likes: currentUserId ? { where: { userId: currentUserId }, select: { userId: true } } : false,
          bookmarks: { where: { userId: currentUserId }, select: { userId: true } },
        }
      }
    },
    orderBy: { createdAt: "desc" }
  }) : [];

  const bookmarkedPosts = bookmarkedRecords.map(b => b.post);

  // Query if profile user has active stories for Amber story ring
  const userStoriesCount = await prisma.story.count({
    where: {
      userId: profileUser.id,
      expiresAt: { gt: new Date() }
    }
  });

  return (
    <ProfileClient
      profileUser={profileUser}
      currentUserId={currentUserId}
      sessionUser={session?.user}
      bookmarkedPosts={bookmarkedPosts}
      userStoriesCount={userStoriesCount}
    />
  );
}
