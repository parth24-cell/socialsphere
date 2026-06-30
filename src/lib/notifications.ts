import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function createNotification({
  userId,
  actorId,
  type,
  entityId,
}: {
  userId: string;
  actorId: string;
  type: "LIKE" | "FOLLOW" | "COMMENT" | "MENTION";
  entityId?: string;
}) {
  if (userId === actorId) return null; // Don't notify self

  const notification = await prisma.notification.create({
    data: {
      userId,
      actorId,
      type,
      entityId,
    },
    include: {
      actor: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  // Trigger real-time event
  try {
    await pusherServer.trigger(`user-${userId}`, "new-notification", notification);
  } catch (error) {
    console.error("Failed to trigger Pusher notification:", error);
  }

  return notification;
}
