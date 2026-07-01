import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import NewChatModal from "./NewChatModal";
import ConversationSidebar from "./ConversationSidebar";
import { AppLayout } from "@/components/navigation/AppLayout";
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
    <AppLayout user={session.user as any}>
      <div className="w-full h-[calc(100vh-64px)] md:h-screen flex bg-zinc-950/20">
        
        {/* Left Sidebar: Conversations */}
        <div className="w-80 md:w-96 border-r border-white/5 flex flex-col h-full z-20 bg-zinc-900/10 backdrop-blur-sm">
          <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Link href="/home" className="flex p-2 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition text-white/70 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-lg font-bold tracking-tight text-white font-heading">Messages</h1>
            </div>
            <NewChatModal users={connectableUsers} />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ConversationSidebar rooms={rooms} currentUserId={session.user.id} />
          </div>
        </div>

        {/* Right Pane: Chat Window */}
        <div className="flex-1 h-full bg-zinc-950/40 relative overflow-hidden">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}
