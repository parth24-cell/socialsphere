import { MessageSquare } from "lucide-react";

export default function MessagesIndexPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
      <MessageSquare className="w-16 h-16 mb-4 text-zinc-300 dark:text-zinc-700" />
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Select a message</h2>
      <p className="mt-2">Choose from your existing conversations, or start a new one.</p>
    </div>
  );
}
