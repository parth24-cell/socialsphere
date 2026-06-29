"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";



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
