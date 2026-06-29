import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex justify-center">
      <div className="w-full max-w-2xl border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-900">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-4">
          <Skeleton className="w-5 h-5 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Cover Image */}
        <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

        {/* Profile Info */}
        <div className="px-4 relative mb-4">
          <div className="flex justify-between items-start">
            <Skeleton className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 absolute -top-12 bg-zinc-300 dark:bg-zinc-700" />
            <div className="w-24 h-24" /> {/* Spacer */}
            <div className="mt-4">
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>

          <div className="mt-4 flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 py-4 flex justify-center">
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* Posts Skeleton */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 flex gap-4">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
