export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium animate-pulse">Loading SocialSphere...</p>
      </div>
    </div>
  );
}
