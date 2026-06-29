"use client";

import { markAllAsRead } from "@/actions/notification";
import { CheckCheck } from "lucide-react";
import { useState } from "react";

export default function MarkAllAsReadButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await markAllAsRead();
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition text-indigo-600 disabled:opacity-50"
      title="Mark all as read"
    >
      <CheckCheck className="w-5 h-5" />
    </button>
  );
}
