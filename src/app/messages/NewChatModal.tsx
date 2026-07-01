"use client";

import { useState } from "react";
import { Plus, X, Search, Loader2 } from "lucide-react";
import { getOrCreateConversation } from "@/actions/messages";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NewChatModal({
  users, 
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
        className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-xl transition-all active:scale-95 ml-auto"
      >
        <Plus className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h2 className="text-base font-bold text-white">Start Conversation</h2>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 hover:bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-white/5 relative">
                <Search className="w-4 h-4 absolute left-7 top-7 text-white/30" />
                <input 
                  type="text"
                  placeholder="Search people..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-amber-500 py-2.5 pl-10 pr-4 rounded-xl outline-none text-white text-sm placeholder:text-white/30 transition-all duration-300"
                />
              </div>

              {/* Users list */}
              <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-white/30 text-sm">No users found.</div>
                ) : (
                  filteredUsers.map((user) => (
                    <button 
                      key={user.id}
                      disabled={isLoading}
                      onClick={() => startChat(user.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition text-left disabled:opacity-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/60 text-base">
                        {user.profile?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-white truncate">
                          {user.profile?.displayName || user.profile?.username}
                        </p>
                        <p className="text-xs text-white/40 truncate">@{user.profile?.username}</p>
                      </div>
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
