"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStory(mediaUrl: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (!mediaUrl) throw new Error("Media URL is required");

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // exactly 24 hours from now

  await prisma.story.create({
    data: {
      userId: session.user.id,
      mediaUrl,
      type: "IMAGE",
      expiresAt,
    },
  });

  revalidatePath("/home");
}

export async function markStoryAsViewed(storyId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const existingView = await prisma.storyView.findFirst({
    where: {
      storyId,
      viewerId: session.user.id,
    },
  });

  if (!existingView) {
    await prisma.storyView.create({
      data: {
        storyId,
        viewerId: session.user.id,
      },
    });
  }
}

export async function deleteStory(storyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story || story.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.story.delete({
    where: { id: storyId },
  });

  revalidatePath("/home");
}

export async function getStoryViews(storyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story || story.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const views = await prisma.storyView.findMany({
    where: { storyId },
    include: {
      viewer: {
        select: {
          id: true,
          profile: true,
        },
      },
    },
    orderBy: { viewedAt: "desc" },
  });

  return views.map((v: any) => v.viewer);
}
