import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
