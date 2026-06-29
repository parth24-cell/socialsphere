"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { sendMessage } from "@/actions/message";
import { Send, Loader2 } from "lucide-react";

type Message = {
  id: string;
  content: string;
  createdAt: Date | string;
  senderId: string;
  sender: { username: string; displayName: string | null; profile: any };
};

type ChatRoomClientProps = {
  roomId: string;
  initialMessages: Message[];
  currentUserId: string;
  pusherKey: string;
  pusherCluster: string;
};

export default function ChatRoomClient({ roomId, initialMessages, currentUserId, pusherKey, pusherCluster }: ChatRoomClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Subscribe to Pusher
  useEffect(() => {
    if (!pusherKey) return; // If env vars aren't set, fallback to non-realtime MVP

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe(`presence-room-${roomId}`);
    
    channel.bind("new-message", (newMsg: Message) => {
      // Don't append if we already added it optimistically
      setMessages((prev) => {
        if (prev.find((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      pusher.unsubscribe(`presence-room-${roomId}`);
    };
  }, [roomId, pusherKey, pusherCluster]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input;
    setInput("");
    setIsSending(true);

    try {
      const newMsg = await sendMessage(roomId, content);
      
      // Optimistic update
      setMessages((prev) => {
        if (prev.find((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg as any];
      });
    } catch (err) {
      console.error(err);
      // Ideally handle error state here
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                isMine 
                  ? "bg-indigo-600 text-white rounded-br-none" 
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-bl-none"
              }`}>
                {!isMine && (
                  <p className="text-xs font-bold mb-1 opacity-75">{msg.sender.displayName || msg.sender.username}</p>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMine ? "text-indigo-200" : "text-zinc-500"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2 outline-none border border-transparent focus:border-indigo-500 text-zinc-900 dark:text-zinc-50"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
