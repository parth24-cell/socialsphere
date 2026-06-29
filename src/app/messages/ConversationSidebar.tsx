"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { socket } from "@/lib/socket";

export default function ConversationSidebar({ 
  rooms, 
  currentUserId 
}: { 
  rooms: any[], 
  currentUserId: string 
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"INBOX" | "REQUESTS">("INBOX");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    socket.on("user_online", (userId: string) => {
      setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    });

    socket.on("user_offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, []);

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
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      <div className="flex border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <button
          onClick={() => setActiveTab("INBOX")}
          className={`flex-1 py-3 text-center text-sm font-semibold transition ${
            activeTab === "INBOX"
              ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Inbox
        </button>
        <button
          onClick={() => setActiveTab("REQUESTS")}
          className={`flex-1 py-3 text-center text-sm font-semibold transition relative ${
            activeTab === "REQUESTS"
              ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Requests
          {rooms.some(r => r.members.find((p: any) => p.userId === currentUserId)?.status === "PENDING") && (
            <span className="absolute top-2.5 right-4 w-2.5 h-2.5 bg-indigo-600 rounded-full" />
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No conversations found.</div>
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
                previewText = `${prefix}🎙️ Voice Message (${lastMessage.voiceMessage.duration}s)`;
              } else if (lastMessage.attachments && lastMessage.attachments.length > 0) {
                const count = lastMessage.attachments.length;
                const type = lastMessage.attachments[0].type.toLowerCase();
                previewText = `${prefix}📎 Sent ${count} ${type}${count > 1 ? "s" : ""}`;
              } else {
                previewText = `${prefix}${lastMessage.content || ""}`;
              }
            }

            return (
              <Link 
                href={`/messages/${room.id}`} 
                key={room.id}
                className={`block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 transition ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 overflow-hidden">
                    {otherUser?.profile?.avatarUrl ? (
                      <img src={otherUser.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover object-center" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500 rounded-full border border-zinc-200 dark:border-zinc-700">
                        {otherUser?.profile?.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1">
                      <p className={`font-bold truncate ${isUnread ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {room.type === "GROUP" ? room.name : (otherUser?.profile?.displayName || otherUser?.profile?.username)}
                      </p>
                      {lastMessage && (
                        <span className="text-xs text-zinc-400 whitespace-nowrap ml-2">
                          {new Date(lastMessage.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate ${isUnread ? 'text-zinc-900 dark:text-zinc-50 font-semibold' : 'text-zinc-500'}`}>
                        {previewText}
                      </p>
                      {isUnread && (
                        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shrink-0 ml-2" />
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
