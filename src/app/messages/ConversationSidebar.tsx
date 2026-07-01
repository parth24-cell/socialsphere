"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ConversationSidebar({ 
  rooms, 
  currentUserId 
}: { 
  rooms: any[], 
  currentUserId: string 
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"INBOX" | "REQUESTS">("INBOX");
  const [onlineUsers] = useState<string[]>([]);
  const pathname = usePathname();

  const filteredRooms = rooms.filter(room => {
    const member = room.members.find((p: any) => p.userId === currentUserId);
    const status = member?.status || "ACCEPTED";

    if (activeTab === "INBOX") {
      if (status !== "ACCEPTED") return false;
    } else {
      if (status !== "PENDING") return false;
    }

    const otherUser = room.members.find((p: any) => p.userId !== currentUserId)?.user;
    const name = room.type === "GROUP" ? room.name : (otherUser?.profile?.displayName || otherUser?.profile?.username);
    return name?.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Search Input */}
      <div className="p-4 border-b border-white/5 bg-white/[0.01]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/30" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none text-white placeholder:text-white/30 transition-all duration-300"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 shrink-0 bg-white/[0.005]">
        <button
          onClick={() => setActiveTab("INBOX")}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all duration-300 relative ${
            activeTab === "INBOX"
              ? "text-amber-500"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          Inbox
          {activeTab === "INBOX" && (
            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("REQUESTS")}
          className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all duration-300 relative ${
            activeTab === "REQUESTS"
              ? "text-amber-500"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          Requests
          {activeTab === "REQUESTS" && (
            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-amber-500 rounded-full" />
          )}
          {rooms.some(r => r.members.find((p: any) => p.userId === currentUserId)?.status === "PENDING") && (
            <span className="absolute top-3 right-8 w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          )}
        </button>
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-sm">No conversations found.</div>
        ) : (
          filteredRooms.map((room: any) => {
            const otherUser = room.members.find((p: any) => p.userId !== currentUserId)?.user;
            const currentUserParticipant = room.members.find((p: any) => p.userId === currentUserId);
            const lastMessage = room.messages[0];
            
            const isUnread = lastMessage && currentUserParticipant?.lastReadAt && new Date(lastMessage.createdAt) > new Date(currentUserParticipant.lastReadAt);
            const isActive = pathname === `/messages/${room.id}`;
            const isOnline = otherUser?.id && (onlineUsers.includes(otherUser.id) || (otherUser.lastSeen && (Date.now() - new Date(otherUser.lastSeen).getTime()) < 60000));

            let previewText = "Start a conversation";
            if (lastMessage) {
              const prefix = lastMessage.senderId === currentUserId ? "You: " : "";
              if (lastMessage.isDeleted) {
                previewText = `${prefix}This message was deleted.`;
              } else if (lastMessage.voiceMessage) {
                previewText = `${prefix}🎙️ Voice Message`;
              } else if (lastMessage.attachments && lastMessage.attachments.length > 0) {
                const count = lastMessage.attachments.length;
                previewText = `${prefix}📎 Sent ${count} attachment${count > 1 ? "s" : ""}`;
              } else {
                previewText = `${prefix}${lastMessage.content || ""}`;
              }
            }

            return (
              <Link 
                href={`/messages/${room.id}`} 
                key={room.id}
                className={`block p-4 transition-all duration-300 hover:bg-white/5 border-l-2 ${
                  isActive 
                    ? "bg-white/[0.04] border-l-amber-500" 
                    : "border-l-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="relative w-11 h-11 rounded-full bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
                    {otherUser?.profile?.avatarUrl ? (
                      <img src={otherUser.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-white/40 text-lg">
                        {otherUser?.profile?.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                    )}
                  </div>

                  {/* Room Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`font-semibold text-sm truncate ${isUnread ? "text-white" : "text-white/80"}`}>
                        {room.type === "GROUP" ? room.name : (otherUser?.profile?.displayName || otherUser?.profile?.username)}
                      </p>
                      {lastMessage && (
                        <span className="text-[10px] text-white/30 whitespace-nowrap ml-2">
                          {new Date(lastMessage.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-xs truncate ${isUnread ? "text-white font-bold" : "text-white/40"}`}>
                        {previewText}
                      </p>
                      {isUnread && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full shrink-0 ml-2 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
