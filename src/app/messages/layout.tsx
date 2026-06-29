import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import NewChatModal from "./NewChatModal";
import ConversationSidebar from "./ConversationSidebar";
export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rooms = await prisma.conversation.findMany({
    where: {
      members: { some: { userId: session.user.id } }
    },
    orderBy: { lastMessageAt: "desc" },
    include: {
      members: {
        include: { user: { include: { profile: true } } }
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          attachments: true,
          voiceMessage: true
        }
      }
    }
  });

  // Fetch users the current user is following or followers
  const connectableUsers = await prisma.user.findMany({
    where: {
      OR: [
        { followers: { some: { followerId: session.user.id } } },
        { following: { some: { followingId: session.user.id } } },
      ],
      id: { not: session.user.id }
    },
    include: { profile: true }
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <div className="w-full max-w-5xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900 flex">
        
        {/* Left Sidebar: Conversations */}
        <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0 z-20">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
            <Link href="/home" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition">
              <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
            </Link>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Messages</h1>
            <NewChatModal users={connectableUsers} />
          </div>
          
          <ConversationSidebar rooms={rooms} currentUserId={session.user.id} />
        </div>

        {/* Right Pane: Chat Window */}
        <div className="flex-1 h-screen sticky top-0 bg-zinc-50 dark:bg-zinc-950/50">
          {children}
        </div>
      </div>
    </div>
  );
}
