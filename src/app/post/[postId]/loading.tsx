import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <div className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">
        <div className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-4">
          <Link href="/home" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
          </Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            Post
          </h1>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm animate-pulse">
            <div className="flex gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/6 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6"></div>
                </div>
                <div className="mt-4 aspect-video w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
