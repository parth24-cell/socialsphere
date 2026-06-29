import { prisma } from "@/lib/prisma";

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

  return prisma.notification.create({
    data: {
      userId,
      actorId,
      type,
      entityId,
    },
  });
}
