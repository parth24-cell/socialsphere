import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const conversation = await prisma.conversation.findUnique({
    where: { id: resolvedParams.conversationId },
    include: {
      members: {
        include: { user: { include: { profile: true } } },
      },
    },
  });

  if (!conversation) {
    return <div className="p-8 text-center text-zinc-500">Conversation not found.</div>;
  }

  // Ensure current user is part of the conversation
  const isMember = conversation.members.some((m) => m.userId === session.user!.id);
  if (!isMember) {
    return <div className="p-8 text-center text-zinc-500">Unauthorized.</div>;
  }

  // Update lastReadAt
  await prisma.conversationMember.update({
    where: {
      conversationId_userId: {
        conversationId: resolvedParams.conversationId,
        userId: session.user.id
      }
    },
    data: { lastReadAt: new Date() }
  });

  const initialMessages = await prisma.message.findMany({
    where: { conversationId: resolvedParams.conversationId },
    orderBy: { createdAt: "desc" },
    take: 50,
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

  const otherUser = conversation.members.find((m) => m.userId !== session.user!.id)?.user;

  return (
    <ChatClient
      conversation={conversation}
      initialMessages={initialMessages.reverse()}
      currentUserId={session.user.id}
      otherUser={otherUser}
    />
  );
}
