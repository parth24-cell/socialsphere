export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto flex justify-center">
        {/* Left Sidebar Skeleton */}
        <div className="hidden sm:flex flex-col w-64 p-4 h-screen border-r border-zinc-200 dark:border-zinc-800">
          <div className="w-32 h-8 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Main Feed Skeleton */}
        <main className="flex-1 max-w-[700px] w-full min-h-screen border-r border-zinc-200 dark:border-zinc-800 p-4">
          <div className="w-24 h-8 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-6" />
          <div className="flex gap-4 mb-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0 animate-pulse" />
            ))}
          </div>
          <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-6 animate-pulse" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </main>

        {/* Right Sidebar Skeleton */}
        <div className="hidden lg:block w-[350px] p-4 h-screen">
          <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse mb-4" />
          <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
