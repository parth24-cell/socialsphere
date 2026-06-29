"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Something went wrong!</h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
        We encountered an error loading your messages. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
