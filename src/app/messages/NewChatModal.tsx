"use client";

import { useState } from "react";
import { Plus, X, Search, Loader2 } from "lucide-react";
import { getOrCreateConversation } from "@/actions/messages";
import { useRouter } from "next/navigation";

export default function NewChatModal({
  users, // Pre-fetched users (followers/following) to start chat with
}: {
  users: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const filteredUsers = users.filter((u) => 
    u.profile?.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.profile?.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const startChat = async (userId: string) => {
    setIsLoading(true);
    try {
      const conv = await getOrCreateConversation(userId);
      setIsOpen(false);
      router.push(`/messages/${conv.id}`);
    } catch (e) {
      console.error("Failed to start chat", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition ml-auto"
      >
        <Plus className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">New Message</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 relative">
              <Search className="w-5 h-5 absolute left-7 top-6 text-zinc-400" />
              <input 
                type="text"
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 py-2 pl-10 pr-4 rounded-full outline-none text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-indigo-500/50 transition"
              />
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">No users found.</div>
              ) : (
                filteredUsers.map((user) => (
                  <button 
                    key={user.id}
                    disabled={isLoading}
                    onClick={() => startChat(user.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600">
                      {user.profile?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-50">
                        {user.profile?.displayName || user.profile?.username}
                      </p>
                      <p className="text-sm text-zinc-500">@{user.profile?.username}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
