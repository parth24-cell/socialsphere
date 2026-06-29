"use client";

import { useState } from "react";
import { getOrCreateDirectRoom } from "@/actions/message";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";

export default function StartChatButton({ targetUserId }: { targetUserId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartChat = async () => {
    setLoading(true);
    try {
      const roomId = await getOrCreateDirectRoom(targetUserId);
      router.push(`/messages/${roomId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300 disabled:opacity-50"
      title="Message"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
    </button>
  );
}
