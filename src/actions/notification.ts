"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.update({
    where: {
      id: notificationId,
      userId: session.user.id, // Ensure they own it
    },
    data: { readAt: new Date() },
  });

  revalidatePath("/notifications");
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  revalidatePath("/notifications");
}

export async function deleteNotification(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.delete({
    where: {
      id: notificationId,
      userId: session.user.id, // Ensure they own it
    },
  });

  revalidatePath("/notifications");
}

export async function getNotifications(cursor?: string, filter?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const where: any = { userId: session.user.id };
  if (filter && filter !== "ALL") {
    where.type = filter;
  }

  const notifications = await prisma.notification.findMany({
    where,
    take: 20,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: { id: true, profile: true },
      },
    },
  });

  return notifications;
}

export async function getNotificationTargetUrl(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: { actor: { include: { profile: true } } }
  });

  if (!notification) {
    return { error: "Notification not found" };
  }

  if (notification.type === "FOLLOW") {
    if (!notification.actor?.profile?.username) {
      return { error: "User no longer exists." };
    }
    return { url: `/${notification.actor.profile.username}` };
  }
  
  if (notification.type === "LIKE") {
    if (!notification.entityId) return { error: "Invalid notification data." };
    const post = await prisma.post.findUnique({ where: { id: notification.entityId } });
    if (!post || post.deletedAt) return { error: "This post is no longer available." };
    return { url: `/post/${post.id}` };
  }
  
  if (notification.type === "COMMENT") {
    if (!notification.entityId) return { error: "Invalid notification data." };
    const comment = await prisma.comment.findUnique({ where: { id: notification.entityId } });
    if (!comment) return { error: "This comment is no longer available." };
    const post = await prisma.post.findUnique({ where: { id: comment.postId } });
    if (!post || post.deletedAt) return { error: "This post is no longer available." };
    return { url: `/post/${post.id}#comment-${comment.id}` };
  }
  
  if (notification.type === "MESSAGE") {
    if (!notification.entityId) return { error: "Invalid notification data." };
    const conv = await prisma.conversation.findUnique({ where: { id: notification.entityId } });
    if (!conv) return { error: "This conversation is no longer available." };
    return { url: `/messages/${conv.id}` };
  }
  
  if (notification.type === "STORY") {
    return { url: `/home?story=${notification.actorId}` };
  }

  return { error: "Unknown notification type." };
}
