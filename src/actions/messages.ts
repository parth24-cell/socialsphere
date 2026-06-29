"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

export async function getConversations() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const conversations = await prisma.conversation.findMany({
    where: {
      members: { some: { userId: session.user.id } },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, profile: true, lastSeen: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          attachments: true,
          voiceMessage: true,
        }
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return conversations;
}

export async function getOrCreateConversation(otherUserId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.id === otherUserId) throw new Error("Cannot message yourself");

  // Check if a direct conversation already exists
  const existingConv = await prisma.conversation.findFirst({
    where: {
      type: "DIRECT",
      AND: [
        { members: { some: { userId: session.user.id } } },
        { members: { some: { userId: otherUserId } } },
      ],
    },
    include: {
      members: true
    }
  });

  if (existingConv) {
    return existingConv;
  }

  // Check if other user follows current user to determine request status
  const otherFollowsMe = await prisma.follower.findUnique({
    where: {
      followerId_followingId: {
        followerId: otherUserId,
        followingId: session.user.id,
      },
    },
  });

  // Create new conversation
  const newConv = await prisma.conversation.create({
    data: {
      type: "DIRECT",
      lastMessageAt: new Date(),
      members: {
        create: [
          { userId: session.user.id, status: "ACCEPTED" },
          { userId: otherUserId, status: otherFollowsMe ? "ACCEPTED" : "PENDING" },
        ],
      },
    },
    include: {
      members: true
    }
  });

  revalidatePath("/messages");
  return newConv;
}

export async function getMessages(conversationId: string, page = 1, limit = 50) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Ensure user is part of the conversation
  const member = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  });

  if (!member) throw new Error("Unauthorized");

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      sender: { select: { id: true, profile: true } },
      attachments: true,
      voiceMessage: true,
      reactions: {
        include: {
          user: { select: { id: true, profile: true } }
        }
      },
      replyToMessage: {
        include: {
          sender: { select: { id: true, profile: true } },
          attachments: true,
          voiceMessage: true
        }
      }
    },
  });

  return messages.reverse(); // Return in chronological order
}

export async function sendMessage(
  conversationId: string,
  content: string | null,
  attachmentsData: Array<{ url: string; type: string; name?: string; size?: number }> = [],
  replyToMessageId: string | null = null,
  voiceMessageData: { url: string; duration: number; waveform?: any } | null = null
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Ensure user is part of the conversation
  const member = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  });

  if (!member) throw new Error("Unauthorized");

  // Get recipient and check if status needs updating
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { members: true },
  });

  if (conversation?.type === "DIRECT") {
    const recipient = conversation.members.find(m => m.userId !== session.user!.id);
    if (recipient) {
      const followsSender = await prisma.follower.findUnique({
        where: {
          followerId_followingId: {
            followerId: recipient.userId,
            followingId: session.user.id
          }
        }
      });
      
      // If followsSender, set status to ACCEPTED if it was PENDING
      if (followsSender && recipient.status === "PENDING") {
        await prisma.conversationMember.update({
          where: { conversationId_userId: { conversationId, userId: recipient.userId } },
          data: { status: "ACCEPTED" }
        });
      } else if (!followsSender && recipient.status !== "ACCEPTED" && recipient.status !== "PENDING") {
        // If not following and not accepted, demote to pending request
        await prisma.conversationMember.update({
          where: { conversationId_userId: { conversationId, userId: recipient.userId } },
          data: { status: "PENDING" }
        });
      }
    }
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content,
      replyToMessageId,
      attachments: {
        create: attachmentsData.map((att) => ({
          url: att.url,
          type: att.type,
          name: att.name || null,
          size: att.size || null,
        })),
      },
      voiceMessage: voiceMessageData ? {
        create: {
          url: voiceMessageData.url,
          duration: voiceMessageData.duration,
          waveform: voiceMessageData.waveform || null,
        }
      } : undefined
    },
    include: {
      sender: { select: { id: true, profile: true } },
      attachments: true,
      voiceMessage: true,
      reactions: {
        include: { user: { select: { id: true, profile: true } } }
      },
      replyToMessage: {
        include: {
          sender: { select: { id: true, profile: true } },
          attachments: true,
          voiceMessage: true
        }
      }
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  const recipientIds = conversation?.members
    .filter(m => m.userId !== session.user!.id)
    .map(m => m.userId) || [];

  // Create notifications
  if (recipientIds.length > 0) {
    await prisma.notification.createMany({
      data: recipientIds.map((rId) => ({
        userId: rId,
        actorId: session.user!.id,
        type: "MESSAGE",
        entityId: conversationId,
      })),
    });
  }

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");

  return { message, recipientIds };
}

export async function markAsRead(conversationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.conversationMember.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
    data: { lastReadAt: new Date() },
  });

  revalidatePath("/messages");
}

export async function handleMessageRequest(conversationId: string, action: "ACCEPT" | "IGNORE" | "BLOCK") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (action === "ACCEPT") {
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
      data: { status: "ACCEPTED" },
    });
  } else if (action === "IGNORE") {
    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
      data: { status: "IGNORED" },
    });
  } else if (action === "BLOCK") {
    // Get senderId
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { members: true },
    });
    const sender = conv?.members.find(m => m.userId !== session.user!.id);
    
    if (sender) {
      await prisma.blockedUser.upsert({
        where: {
          blockerId_blockedId: {
            blockerId: session.user.id,
            blockedId: sender.userId,
          },
        },
        create: {
          blockerId: session.user.id,
          blockedId: sender.userId,
        },
        update: {},
      });
    }

    await prisma.conversationMember.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
      data: { status: "IGNORED" },
    });
  }

  revalidatePath("/messages");
}

export async function editMessage(messageId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) throw new Error("Message not found");
  if (message.senderId !== session.user.id) throw new Error("Unauthorized");
  if (message.isDeleted) throw new Error("Cannot edit deleted message");

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: {
      content,
      isEdited: true,
      editedAt: new Date(),
    },
    include: {
      sender: { select: { id: true, profile: true } },
      attachments: true,
      voiceMessage: true,
      reactions: {
        include: { user: { select: { id: true, profile: true } } }
      },
      replyToMessage: {
        include: {
          sender: { select: { id: true, profile: true } },
          attachments: true,
          voiceMessage: true
        }
      }
    },
  });

  revalidatePath(`/messages/${message.conversationId}`);
  return updated;
}

export async function deleteMessage(messageId: string, deleteType: "ME" | "EVERYONE") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) throw new Error("Message not found");

  if (deleteType === "ME") {
    let deletedList: string[] = [];
    if (message.deletedForUsers) {
      try {
        deletedList = JSON.parse(message.deletedForUsers);
      } catch (e) {
        deletedList = [];
      }
    }
    if (!deletedList.includes(session.user.id)) {
      deletedList.push(session.user.id);
    }
    
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { deletedForUsers: JSON.stringify(deletedList) },
    });
    
    revalidatePath(`/messages/${message.conversationId}`);
    return { success: true, messageId, deletedForUsers: deletedList, isDeleted: false };
  } else {
    // Delete for everyone
    if (message.senderId !== session.user.id) throw new Error("Unauthorized");

    // 24 hour limit check
    const timeElapsed = (Date.now() - new Date(message.createdAt).getTime()) / (1000 * 60 * 60);
    if (timeElapsed > 24) {
      throw new Error("You can only delete messages within 24 hours.");
    }

    // Soft delete message
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: "This message was deleted.",
        isDeleted: true,
        deletedAt: new Date(),
        // Disconnect attachments and voice message
        attachments: { deleteMany: {} },
      },
    });

    // Also delete associated voice message if exists
    try {
      await prisma.voiceMessage.delete({ where: { messageId } });
    } catch (e) {
      // Ignored if no voice message
    }

    revalidatePath(`/messages/${message.conversationId}`);
    return { success: true, messageId, isDeleted: true };
  }
}

export async function toggleReaction(messageId: string, emoji: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existingReaction = await prisma.messageReaction.findFirst({
    where: {
      messageId,
      userId: session.user.id,
      emoji,
    },
  });

  if (existingReaction) {
    await prisma.messageReaction.delete({
      where: { id: existingReaction.id },
    });
  } else {
    await prisma.messageReaction.create({
      data: {
        messageId,
        userId: session.user.id,
        emoji,
      },
    });
  }

  const updatedReactions = await prisma.messageReaction.findMany({
    where: { messageId },
    include: { user: { select: { id: true, profile: true } } },
  });

  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (message) {
    revalidatePath(`/messages/${message.conversationId}`);
  }

  return updatedReactions;
}

export async function togglePin(messageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) throw new Error("Message not found");

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: {
      isPinned: !message.isPinned,
      pinnedAt: !message.isPinned ? new Date() : null,
    },
  });

  revalidatePath(`/messages/${message.conversationId}`);
  return updated;
}

export async function searchMessages(conversationId: string, query: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      content: { contains: query, mode: "insensitive" },
      isDeleted: false,
    },
    include: {
      sender: { select: { id: true, profile: true } },
      attachments: true,
      voiceMessage: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return messages;
}

export async function uploadMessageAttachments(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const files = formData.getAll("files") as File[];
  const attachments = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "socialsphere_messages", resource_type: "auto", timeout: 60000 }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    let type = "FILE";
    if (result.resource_type === "image") type = "IMAGE";
    else if (result.resource_type === "video") type = "VIDEO";

    attachments.push({
      url: result.secure_url,
      type,
      name: file.name,
      size: file.size,
    });
  }

  return attachments;
}

export async function updatePresenceStatus() {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastSeen: new Date() },
  });
}
