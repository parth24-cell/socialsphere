import { MessageSquare, Sparkles } from "lucide-react";

export default function MessagesIndexPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-amber-500/80 flex items-center justify-center mb-6 shadow-xl backdrop-blur-md">
        <MessageSquare className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Your Conversations</h2>
      <p className="text-white/40 text-sm max-w-xs mx-auto">
        Choose an existing thread from the list, or start a new one to connect with others.
      </p>
    </div>
  );
}
