export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950/50 p-6 space-y-4 animate-pulse">
      <div className="flex gap-3 justify-end">
        <div className="w-64 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-2xl rounded-br-sm"></div>
      </div>
      <div className="flex gap-3 justify-start">
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
        <div className="w-48 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-2xl rounded-bl-sm"></div>
      </div>
      <div className="flex gap-3 justify-start">
        <div className="w-8 h-8 shrink-0"></div>
        <div className="w-72 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl rounded-bl-sm"></div>
      </div>
      <div className="flex gap-3 justify-end">
        <div className="w-56 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-2xl rounded-br-sm"></div>
      </div>
    </div>
  );
}
