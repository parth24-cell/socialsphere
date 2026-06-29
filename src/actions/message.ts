"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Pusher from "pusher";
import { revalidatePath } from "next/cache";

// Initialize Pusher only if env vars are present (to avoid crashing if user hasn't set them yet)
const pusher = process.env.PUSHER_APP_ID && process.env.PUSHER_SECRET ? new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
  useTLS: true,
}) : null;

export async function sendMessage(conversationId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const currentUserId = session.user.id;

  // Verify user is part of the conversation
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      members: {
        some: { userId: currentUserId }
      }
    }
  });

  if (!conversation) throw new Error("Conversation not found or unauthorized");

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: currentUserId,
      content,
    },
    include: {
      sender: {
        select: { id: true, profile: true }
      }
    }
  });

  // Update room last activity
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() }
  });

  // Trigger Pusher event
  if (pusher) {
    try {
      await pusher.trigger(`presence-room-${conversationId}`, "new-message", message);
    } catch (err) {
      console.error("Pusher trigger error:", err);
    }
  }

  revalidatePath("/messages");
  return message;
}

export async function getOrCreateDirectRoom(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const currentUserId = session.user.id;

  // Find existing room with exactly these two users
  const existingRooms = await prisma.conversation.findMany({
    where: {
      type: "DIRECT",
      members: {
        some: { userId: currentUserId }
      }
    },
    include: { members: true }
  });

  const room = existingRooms.find((r: any) => 
    r.members.length === 2 && 
    r.members.some((p: any) => p.userId === targetUserId)
  );

  if (room) return room.id;

  // Create new room
  const newRoom = await prisma.conversation.create({
    data: {
      type: "DIRECT",
      members: {
        create: [
          { userId: currentUserId, role: "ADMIN" },
          { userId: targetUserId, role: "MEMBER" }
        ]
      }
    }
  });

  revalidatePath("/messages");
  return newRoom.id;
}
