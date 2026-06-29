import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-zinc-50 dark:bg-zinc-950/50">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
