"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function toggleFollow(targetUserId: string, currentPath: string = "/home") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentUserId = session.user.id;
  if (currentUserId === targetUserId) throw new Error("Cannot follow yourself");

  let followed = false;

  await prisma.$transaction(async (tx: any) => {
    const existingFollow = await tx.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await tx.follower.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId
          }
        }
      });
      followed = false;
    } else {
      // Follow
      await tx.follower.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });

      // Create a notification if one hasn't been created recently (prevent duplicate spam)
      const existingNotification = await tx.notification.findFirst({
        where: {
          userId: targetUserId,
          actorId: currentUserId,
          type: "FOLLOW",
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within 24 hours
          }
        }
      });

      if (!existingNotification) {
        await tx.notification.create({
          data: {
            userId: targetUserId, // Receiver
            actorId: currentUserId, // Sender
            type: "FOLLOW",
          },
        });
      }

      followed = true;
    }
  });

  // Revalidate the entire application layout to ensure all components 
  // (Home, Profile, Suggestions, Notifications, Search) are in sync.
  revalidatePath("/", "layout");

  return { followed };
}
