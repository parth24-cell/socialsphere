"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getFeedPosts(page = 1, limit = 20) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const rawPosts = await prisma.post.findMany({
    where: {
      OR: [
        { authorId: session.user.id },
        { author: { followers: { some: { followerId: session.user.id } } } }
      ]
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      author: { select: { id: true, profile: true } },
      images: true,
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.user.id }, select: { userId: true } },
      bookmarks: { where: { userId: session.user.id }, select: { userId: true } },
    },
  });

  // Basic ranking
  const rankedPosts = rawPosts.sort((a: any, b: any) => {
    const ageAInHours = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
    const scoreA = (a._count.likes * 2 + a._count.comments * 3) / Math.pow(ageAInHours + 2, 1.5);

    const ageBInHours = (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);
    const scoreB = (b._count.likes * 2 + b._count.comments * 3) / Math.pow(ageBInHours + 2, 1.5);

    return scoreB - scoreA;
  });

  return rankedPosts;
}

export async function getExplorePosts(page = 1, limit = 20) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const rawPosts = await prisma.post.findMany({
    where: {
      visibility: "PUBLIC",
      deletedAt: null, // Exclude deleted posts
      author: {
        blockedBy: { none: { blockerId: session.user.id } },
        blocking: { none: { blockedId: session.user.id } }
      }
    },
    orderBy: { createdAt: "desc" }, // Fetch by recent first before ranking
    take: limit,
    skip: (page - 1) * limit,
    include: {
      author: { select: { id: true, profile: true } },
      images: true,
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.user.id }, select: { userId: true } },
      bookmarks: { where: { userId: session.user.id }, select: { userId: true } },
    },
  });

  // Ranking formula (engagement/recency)
  const rankedPosts = rawPosts.sort((a: any, b: any) => {
    const ageAInHours = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
    const scoreA = (a._count.likes * 2 + a._count.comments * 3) / Math.pow(ageAInHours + 2, 1.5);

    const ageBInHours = (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);
    const scoreB = (b._count.likes * 2 + b._count.comments * 3) / Math.pow(ageBInHours + 2, 1.5);

    return scoreB - scoreA;
  });

  return rankedPosts;
}
